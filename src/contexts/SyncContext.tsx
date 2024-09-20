import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import useProductDatabase from '../database/useProductDatabase';
import useDayDatabase from '../database/useDayDatabase';
import { getProduct as getProductRemote, postProduct as postProductRemote} from '../httpservices/product';
import { getDay as getDayRemote} from '../httpservices/day';

import usePendingOperationDatabase from '../database/usePendingOperationDatabase';
import axios from 'axios';
import { ProductType } from '../types/types';
const baseUrl = process.env.EXPO_PUBLIC_BASE_URL

type SyncContextType = {
  setIsConnected: Dispatch<SetStateAction<boolean | null>>,
  isConnected: boolean | null;
  syncData: () => Promise<void>;
  postProduct: (product: Omit<ProductType, "id_produto">) => Promise<ProductType[]>,
  getProduct: (name?: String | undefined) => Promise<any>
  getDay: (id_pessoa?: Number | undefined) => Promise<any>
};

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const productDatabase = useProductDatabase();
  const dayDatabase = useDayDatabase();
  const pendingOperationDatabase = usePendingOperationDatabase()


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      syncData();
    }
  }, [isConnected]);

  const syncData = async () => {
    let operacoesPendentes = await pendingOperationDatabase.getPendingOperationNotSinc()

    for (const operacaoPendente of operacoesPendentes) {
      try {
        if (operacaoPendente.metodo === "POST") {
          try {
            await axios.post(operacaoPendente.url);
          } catch (error) {
            return;
          }
          pendingOperationDatabase.brandSincPendingOperation(operacaoPendente.id_operacoes_pendentes);

        } else if (operacaoPendente.metodo === "PUT") {
          try {
            await axios.put(operacaoPendente.url, operacaoPendente.body);
          } catch (error) {
            return;
          }
          pendingOperationDatabase.brandSincPendingOperation(operacaoPendente.id_operacoes_pendentes);

        } else if (operacaoPendente.metodo === "DELETE") {

        }
      } catch (error) {
        console.error(`Erro ao sincronizar operação pendente: ${error}`);
      }
    }

    await getProduct();
  };

  async function getDay(){

    const response = await getDayRemote();

    if (response.status === 571) {
      const response = await dayDatabase.getDay()
      return {response: response, origemDados: "Local"}
    }

    productDatabase.updateProductList(response.data.items)

    return {response: response.data.items, origemDados: "Remoto"};
  }

  async function postProduct(produto: Omit<ProductType, "id_produto">): Promise<ProductType[]> {
    const url = `${baseUrl}/produto/?nome=${produto.nome}&descricao=${produto.descricao}&preco=${produto.preco}&tempo_minuto=${produto.tempo_minuto}&data_modificado=${produto.data_modificado}&cod_referencia=${produto.cod_referencia}&modificado_por=${produto.modificado_por}`

    const response = await postProductRemote(url);
    if (response.status === 571) {
      pendingOperationDatabase.postPendingOperation({ metodo: "POST", url: url });
      return await productDatabase.postProduct(produto);
    }

    return response.data.items;
  }

  async function getProduct(name?: String){

    const response = await getProductRemote();

    if (response.status === 571) {
      const response = await productDatabase.getProduct()
      return {response: response, origemDados: "Local"}
    }

    productDatabase.updateProductList(response.data.items)

    return {response: response.data.items, origemDados: "Remoto"};
  }

  return (
    <SyncContext.Provider value={{ setIsConnected, isConnected, syncData, postProduct, getProduct, getDay }}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = (): SyncContextType => {
  const context = useContext(SyncContext);
  if (context === undefined) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
};