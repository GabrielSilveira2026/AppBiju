import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import useProductDatabase from '../database/useProductDatabase';
import useDayDatabase from '../database/useDayDatabase';
import { getProduct as getProductRemote } from '../httpservices/product';
import { getDay as getDayRemote } from '../httpservices/day';
import { getPending as getPendingRemote } from '../httpservices/payment';
import { getProduction as getProductionRemote } from '../httpservices/production';

import usePendingOperationDatabase from '../database/usePendingOperationDatabase';
import axios from 'axios';
import { ProductionType, ProductType } from '../types/types';
import { useAuthContext } from './AuthContext';
import usePendingPaymentDatabase from '../database/usePendingPaymentDatabase';
import { getPeople as getPeopleRemote } from '../httpservices/user';
import usePeopleDatabase from '../database/usePeopleDatabase';
import { getParam } from '../httpservices/paramer';
import useParamDatabase from '../database/useParamDatabase';
import { Text, View } from 'react-native';
import 'react-native-get-random-values'
import { customAlphabet } from 'nanoid'
import useProductionDatabase from '../database/useProductionDatabase';

const baseUrl = process.env.EXPO_PUBLIC_BASE_URL

type SyncContextType = {
  syncData: () => Promise<void>,
  isConnected: boolean | null,
  nanoid: (size?: number) => string,
  setIsConnected: Dispatch<SetStateAction<boolean | null>>,
  getHourValue: (id_parametro?: number | undefined) => Promise<any>,
  updateHourValue: (valor: number, data_inicio: string) => Promise<any>
  getPeople: (id_pessoa?: number | undefined) => Promise<any>,
  getPendingPayment: (id_pessoa?: number | undefined) => Promise<any>,
  getDay: (id_pessoa?: number | undefined) => Promise<any>,
  postDay: (id_pessoa: number, data_dia_producao: string, id_dia: string) => Promise<any>,
  getProduct: (name?: String | undefined) => Promise<any>,
  postProduct: (product: ProductType) => Promise<any>,
  uptdateProduct: (data_inicio: string, produto: ProductType) => Promise<any>,
  getProduction: (id_dia?: string) => Promise<any>,
  postProduction: (production: ProductionType) => Promise<any>
};

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const { user } = useAuthContext()
  const nanoid = customAlphabet('1234567890abcdef', 6)

  const productDatabase = useProductDatabase();
  const peopleDatabase = usePeopleDatabase();
  const dayDatabase = useDayDatabase();
  const paramDatabase = useParamDatabase();
  const pendingPaymentDatabase = usePendingPaymentDatabase();
  const pendingOperationDatabase = usePendingOperationDatabase()
  const productionDatabase = useProductionDatabase()

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    // syncData();

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
      if (operacaoPendente.metodo === "POST") {

        await axios.post(operacaoPendente.url, operacaoPendente.body).catch(function (error) {
          if (error.response) {
            console.warn(error.response)
            return
          } else if (error.request) {
            console.warn(error.request)
            return
          } else {
            console.warn(error.message)
            return
          }
        });

        await pendingOperationDatabase.brandSincPendingOperation(operacaoPendente.id_operacoes_pendentes);

      }
      else if (operacaoPendente.metodo === "PUT") {

        await axios.put(operacaoPendente.url, operacaoPendente.body).catch(function (error) {
          if (error.response) {
            console.warn(error.response)
            return
          } else if (error.request) {
            console.warn(error.request)
            return
          } else {
            console.warn(error.message)
            return
          }
        });

        await pendingOperationDatabase.brandSincPendingOperation(operacaoPendente.id_operacoes_pendentes);

      } else if (operacaoPendente.metodo === "DELETE") {

      }
    }

    await getPeople(user?.id_perfil === 3 ? user?.id_pessoa : undefined);
    await getPendingPayment(user?.id_perfil === 3 ? user?.id_pessoa : undefined)
    await getHourValue();
    await getProduct();
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
    const body = JSON.stringify({ data_inicio, valor })

    const response: any = await axios.put(url, body).catch(function (error) {
      return { status: 571 }
    });

    if (response.status === 571) {
      await pendingOperationDatabase.postPendingOperation({ metodo: "PUT", url: url, body });
      const response = await paramDatabase.updateParam(1, data_inicio, valor);
      return { response: { status: response.status }, origemDados: "Local" };
    }

    await getHourValue()

    return { response: { status: response.status }, origemDados: "Remoto" };
  }

  async function getPeople(id_pessoa?: number) {
    const response = await getPeopleRemote(id_pessoa)

    if (response.status === 571) {
      const response = await peopleDatabase.getPeople()
      return { response: response, origemDados: "Local" }
    }

    await peopleDatabase.updatePeopleList(response.data.items)

    const localData = await peopleDatabase.getPeople(id_pessoa)

    return { response: localData, origemDados: "Remoto" };
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
    const request = await getDayRemote(id_pessoa);

    if (request.status === 571) {
      const localData = await dayDatabase.getDay(id_pessoa)
      return { response: localData, origemDados: "Local" }
    }

    await dayDatabase.updateDiaList(request.data.items, id_pessoa)

    const localData = await dayDatabase.getDay(id_pessoa)

    return { response: localData, origemDados: "Remoto" };
  }

  async function postDay(id_pessoa: number, data_dia_producao: string, id_dia: string) {
    const url = `${baseUrl}/dia/?id_dia=${id_dia}&id_pessoa=${id_pessoa}&data_dia_producao=${data_dia_producao}`

    const response: any = await axios.post(url).catch(function (error) {
      return { status: 571 }
    });

    if (response.status === 571) {
      pendingOperationDatabase.postPendingOperation({ metodo: "POST", url: url });
      return await dayDatabase.postDay({id_pessoa, data_dia_producao, id_dia});
    }

    await getDay(id_pessoa)

    return { response: response, origemDados: "Remoto" };
  }

  async function getProduct(name?: String) {

    const request = await getProductRemote();

    if (request.status === 571) {
      const request = await productDatabase.getProduct()
      return { response: request, origemDados: "Local" }
    }

    await productDatabase.updateProductList(request.data.items)

    const localData = await productDatabase.getProduct()

    return { response: localData, origemDados: "Remoto" };
  }

  async function postProduct(produto: ProductType) {
    const url = `${baseUrl}/produto/${produto.id_produto}?nome=${produto.nome}&descricao=${produto.descricao}&preco=${produto.preco}&tempo_minuto=${produto.tempo_minuto}&data_modificado=${produto.data_modificado}&cod_referencia=${produto.cod_referencia}&modificado_por=${produto.modificado_por}`

    const request: any = await axios.post(url).catch(function (error) {
      return { status: 571 }
    });

    if (request.status === 571) {
      await pendingOperationDatabase.postPendingOperation({ metodo: "POST", url: url });
      const request = await productDatabase.postProduct(produto);
      return { response: request, origemDados: "Local" }
    }

    await getProduct()

    return { response: request.data.items, origemDados: "Remoto" };
  }

  async function uptdateProduct(data_inicio: string, product: ProductType) {
    const url = `${baseUrl}/produto/${product.id_produto}`

    const body = JSON.stringify({
      "cod_referencia": product.cod_referencia,
      "data_modificado": product.data_modificado,
      "descricao": product.descricao?.trim(),
      "modificado_por": product.modificado_por,
      "nome": product.nome?.trim(),
      "preco": product.preco,
      "tempo_minuto": product.tempo_minuto,
      "ultimo_valor": product.ultimo_valor,
      "data_inicio": data_inicio
    })

    const response: any = await axios.put(url, body).catch(function (error) {
      return { status: 571 }
    });

    if (response.status === 571) {
      if (product?.id_produto) {

        await pendingOperationDatabase.postPendingOperation({ metodo: "PUT", url: url, body: body });

        const response = await productDatabase.updateProduct(product, data_inicio)

        return { response: response, origemDados: "Local" }
      }
      return { response: [], origemDados: "Local" }
    }

    await getProduct()

    return { response: response.data.items, origemDados: "Remoto" };
  }

  async function getProduction(id_dia?: string) {
    const requestRemote = await getProductionRemote(id_dia)

    if (requestRemote.status === 571) {
      const request = await productionDatabase.getProduction(id_dia)
      return { response: request, origemDados: "Local" }
    }

    await productionDatabase.updateProductionList(requestRemote.data.items, id_dia)
    
    const localData = await productionDatabase.getProduction(id_dia)

    return { response: localData, origemDados: "Remoto" };
  }

  async function postProduction(production: ProductionType) {
    const url = `${baseUrl}/producao/${production.id_producao}?id_dia=${production.id_dia}&id_produto=${production.id_produto}&quantidade=${production.quantidade}&observacao=${production.observacao}`

    const request: any = await axios.post(url).catch(function (error) {
      return { status: 571 }
    });

    if (request.status === 571) {
      await pendingOperationDatabase.postPendingOperation({ metodo: "POST", url: url });
      const request = await productionDatabase.postProduction(production);
      return { response: request, origemDados: "Local" }
    }

    await getProduction(production.id_dia)

    return { response: request.data.items, origemDados: "Remoto" };
  }

  return (
    <SyncContext.Provider value={{ postProduction, getProduction, uptdateProduct, updateHourValue, setIsConnected, isConnected, syncData, postProduct, getProduct, getPeople, getDay, postDay, getPendingPayment, getHourValue, nanoid }}>
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