import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import useProductDatabase from '../database/useProductDatabase';
import useDayDatabase from '../database/useDayDatabase';
import { getProduct as getProductRemote, postProduct as postProductRemote } from '../httpservices/product';
import { getDay as getDayRemote } from '../httpservices/day';
import { getPending as getPendingRemote } from '../httpservices/payment';

import usePendingOperationDatabase from '../database/usePendingOperationDatabase';
import axios from 'axios';
import { ProductType } from '../types/types';
import { useAuthContext } from './AuthContext';
import usePendingPaymentDatabase from '../database/usePendingPaymentDatabase';
import { getPeople as getPeopleRemote } from '../httpservices/user';
import usePeopleDatabase from '../database/usePeopleDatabase';
import { getParam } from '../httpservices/paramer';
import useParamDatabase from '../database/useParamDatabase';
const baseUrl = process.env.EXPO_PUBLIC_BASE_URL

type SyncContextType = {
  setIsConnected: Dispatch<SetStateAction<boolean | null>>,
  isConnected: boolean | null;
  syncData: () => Promise<void>;
  postProduct: (product: Omit<ProductType, "id_produto">) => Promise<ProductType[]>,
  getProduct: (name?: String | undefined) => Promise<any>,
  getDay: (id_pessoa?: number | undefined) => Promise<any>,
  updateHourValue: (valor: number, data_inicio: string) => Promise<any>
  getHourValue: (id_parametro?: number | undefined) => Promise<any>,
  postDay: (id_pessoa: number, data_dia_producao: string) => Promise<any>,
  getPendingPayment: (id_pessoa?: number | undefined) => Promise<any>
};

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const { user } = useAuthContext()
  const productDatabase = useProductDatabase();
  const peopleDatabase = usePeopleDatabase();
  const dayDatabase = useDayDatabase();
  const paramDatabase = useParamDatabase();
  const pendingPaymentDatabase = usePendingPaymentDatabase();
  const pendingOperationDatabase = usePendingOperationDatabase()

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    syncData();

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

    await getPeople(user?.id_perfil === 3 ? user?.id_pessoa : undefined);
    await getPendingPayment(user?.id_perfil === 3 ? user?.id_pessoa : undefined)
  };

  async function getHourValue() {
    const response = await getParam("hora")
    if (response.status === 571) {
      const response = await paramDatabase.getParam("hora")
      return { response: response, origemDados: "Local" }
    }

    await paramDatabase.updateParamList(response.data.items)

    return { response: response.data.items, origemDados: "Remoto" };
  }

  async function updateHourValue(valor: number, data_inicio: string) {
    const url = `${baseUrl}/parametro/update/1`
    const body = JSON.stringify({data_inicio, valor})
        
    const response: any = await axios.put(url, body).catch(function (error) {
      return { status: 571 }
    });

    if (response.status === 571) {
      await pendingOperationDatabase.postPendingOperation({ metodo: "PUT", url: url, body});
      const response = await paramDatabase.updateParam(1, data_inicio, valor);
      return { response: { status: response.status }, origemDados: "Remoto" };
    }

    return { response: { status: response.status }, origemDados: "Remoto" };
  }

  async function getPeople(id_pessoa?: number) {
    const response = await getPeopleRemote(id_pessoa)
    if (response.status === 571) {
      const response = await peopleDatabase.getPeople()
      return { response: response, origemDados: "Local" }
    }

    await peopleDatabase.updatePeopleList(response.data.items)
    
    return { response: response.data.items, origemDados: "Remoto" };
  }

  async function getPendingPayment(id_pessoa?: number) {
    const response = await getPendingRemote(id_pessoa);

    if (response.status === 571) {
      const response = await pendingPaymentDatabase.getPendingPayment(id_pessoa)
      return { response: response, origemDados: "Local" }
    }

    await pendingPaymentDatabase.updatePendingPaymentList(response.data.items, id_pessoa)

    return { response: response.data.items, origemDados: "Remoto" };
  }

  async function getDay(id_pessoa?: number) {

    const response = await getDayRemote(id_pessoa);

    if (response.status === 571) {
      const response = await dayDatabase.getDay(id_pessoa)
      return { response: response, origemDados: "Local" }
    }

    await dayDatabase.updateDiaList(response.data.items, id_pessoa)

    return { response: response.data.items, origemDados: "Remoto" };
  }

  async function postDay(id_pessoa: number, data_dia_producao: string) {
    const url = `${baseUrl}/dia/?id_pessoa=${id_pessoa}&data_dia_producao=${data_dia_producao}`

    const response: any = await axios.post(url).catch(function (error) {
      return { status: 571 }
    });

    if (response.status === 571) {
      pendingOperationDatabase.postPendingOperation({ metodo: "POST", url: url });
      // return await dayDatabase.postDay(id_pessoa, data_dia_producao);
    }
    let data = {
      "data_dia_producao": response.data.data_dia_producao,
      "id_dia": response.data.id_dia,
      "id_pessoa": response.data.id_pessoa
    }
    return { response: data, origemDados: "Remoto" };
  }

  async function postProduct(produto: Omit<ProductType, "id_produto">): Promise<ProductType[]> {
    const url = `${baseUrl}/produto/?nome=${produto.nome}&descricao=${produto.descricao}&preco=${produto.preco}&tempo_minuto=${produto.tempo_minuto}&data_modificado=${produto.data_modificado}&cod_referencia=${produto.cod_referencia}&modificado_por=${produto.modificado_por}`

    const response: any = await axios.post(url).catch(function (error) {
      return { status: 571 }
    });

    if (response.status === 571) {
      pendingOperationDatabase.postPendingOperation({ metodo: "POST", url: url });
      return await productDatabase.postProduct(produto);
    }

    return response.data.items;
  }

  async function getProduct(name?: String) {

    const response = await getProductRemote();

    if (response.status === 571) {
      const response = await productDatabase.getProduct()
      return { response: response, origemDados: "Local" }
    }

    await productDatabase.updateProductList(response.data.items)

    return { response: response.data.items, origemDados: "Remoto" };
  }

  return (
    <SyncContext.Provider value={{ updateHourValue, setIsConnected, isConnected, syncData, postProduct, getProduct, getDay, postDay, getPendingPayment, getHourValue }}>
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