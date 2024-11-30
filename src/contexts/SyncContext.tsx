import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import useProductDatabase from '../database/useProductDatabase';
import useDayDatabase from '../database/useDayDatabase';
import { getProduct as getProductRemote } from '../httpservices/product';
import { getDay as getDayRemote } from '../httpservices/day';
import { getPending as getPendingRemote } from '../httpservices/payment';
import { getProduction as getProductionRemote } from '../httpservices/production';
import { getPayment as getPaymentRemote } from '../httpservices/payment';

import usePendingOperationDatabase from '../database/usePendingOperationDatabase';
import axios from 'axios';
import { DayType, PaymentType, ProductionType, ProductType } from '../types/types';
import { useAuthContext } from './AuthContext';
import { getPeople as getPeopleRemote } from '../httpservices/user';
import usePeopleDatabase from '../database/usePeopleDatabase';
import { getParam } from '../httpservices/paramer';
import useParamDatabase from '../database/useParamDatabase';
import 'react-native-get-random-values'
import { customAlphabet } from 'nanoid'
import useProductionDatabase from '../database/useProductionDatabase';
import { constants } from '../constants/constants';
import usePaymentDatabase from '../database/usePaymentDatabase';
import { Text, View } from 'react-native';
import { colors } from '@/styles/color';

const baseUrl = process.env.EXPO_PUBLIC_BASE_URL

type SyncContextType = {
  syncData: () => Promise<void>,
  isConnected: boolean | null,
  nanoid: (size?: number) => string,
  setIsConnected: Dispatch<SetStateAction<boolean | null>>,
  getHourValue: (id_parametro?: number) => Promise<any>,
  updateHourValue: (valor: number, data_inicio: string) => Promise<any>
  getPeople: (id_pessoa?: number) => Promise<any>,
  getPendingPayment: (id_pessoa?: number) => Promise<any>,
  getDay: (page: number, id_pessoa?: number) => Promise<any>,
  postDay: (id_pessoa: number, data_dia_producao: string, id_dia: string) => Promise<any>,
  updateDay: (dia: DayType) => Promise<any>,
  deleteDay: (dia: DayType) => Promise<any>,
  getProduct: (name?: String) => Promise<any>,
  postProduct: (product: ProductType) => Promise<any>,
  updateProduct: (data_inicio: string, produto: ProductType) => Promise<any>,
  deleteProduct: (id_produto: string) => Promise<any>,
  getProduction: (id_dia?: string) => Promise<any>,
  postProduction: (production: ProductionType) => Promise<any>,
  updateProduction: (production: ProductionType) => Promise<any>,
  deleteProduction: (production: ProductionType) => Promise<any>,
  getPayment: (id_pessoa?: number) => Promise<any>,
  postPayment: (payment: PaymentType) => Promise<any>,
  deletePayment: (id_payment: string) => Promise<any>,
};

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const { user } = useAuthContext()
  const nanoid = customAlphabet('1234567890abcdef', 6)
  const [message, setMessage] = useState<string>("");

  const productDatabase = useProductDatabase();
  const peopleDatabase = usePeopleDatabase();
  const dayDatabase = useDayDatabase();
  const paramDatabase = useParamDatabase();
  const pendingOperationDatabase = usePendingOperationDatabase()
  const productionDatabase = useProductionDatabase()
  const paymentDatabase = usePaymentDatabase()


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

  async function syncData() {

    let operacoesPendentes = await pendingOperationDatabase.getPendingOperationNotSinc()

    for (const operacaoPendente of operacoesPendentes) {
      if (operacaoPendente.metodo === "POST") {

        await axios.post(operacaoPendente.url)
          .catch(function (error) {
            if (error.response) {
              console.warn("Erro de resposta:", error.response.status, error.response.data);
              return
            } else if (error.request) {
              console.warn("Erro de requisição:", error.request);
              return
            } else {
              console.warn("Erro:", error.message);
              return
            }
          });
        await pendingOperationDatabase.brandSincPendingOperation(operacaoPendente.id_operacoes_pendentes);

      }
      else if (operacaoPendente.metodo === "PUT") {

        await axios.put(operacaoPendente.url, operacaoPendente.body, {
          headers: {
            'Content-Type': 'application/json',
          },
        }).catch(function (error) {
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
        await axios.delete(operacaoPendente.url).catch(function (error) {
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
    }

    await productionDatabase.deleteProduction()
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

    await peopleDatabase.updatePeopleList(response.data.items, id_pessoa)

    const localData = await peopleDatabase.getPeople(id_pessoa)

    return { response: localData, origemDados: "Remoto" };
  }

  async function getDay(page: number, id_pessoa?: number) {
    const request = await getDayRemote(page, id_pessoa);

    if (request.status === 571) {
      const localData = await dayDatabase.getDay(id_pessoa)
      return { response: localData, origemDados: "Local" }
    }
    if (page === 0) {
      await dayDatabase.updateDiaList(request.data.items, id_pessoa)
    }

    return { response: request.data.items, hasMore: request.data.hasMore, origemDados: "Remoto" };
  }

  async function postDay(id_pessoa: number, data_dia_producao: string, id_dia: string) {
    const url = `${baseUrl}/dia/?id_dia=${id_dia}&id_pessoa=${id_pessoa}&data_dia_producao=${data_dia_producao}`

    const response: any = await axios.post(url).catch(function (error) {
      return { status: 571 }
    });

    if (response.status === 571) {
      pendingOperationDatabase.postPendingOperation({ metodo: "POST", url: url });
      return await dayDatabase.postDay({ id_pessoa, data_dia_producao, id_dia });
    }

    await getDay(id_pessoa)

    return { response: response, origemDados: "Remoto" };
  }

  async function updateDay(day: DayType) {
    const url = `${baseUrl}/dia/${day.id_dia}`

    const body = JSON.stringify({
      id_pessoa: day.id_pessoa,
      data_dia_producao: day.data_dia_producao
    })

    const request: any = await axios.put(url, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch(function (error) {
      return { status: 571 }
    });

    if (request.status === 571) {
      pendingOperationDatabase.postPendingOperation({ metodo: "PUT", url: url, body: body });
      const response = await dayDatabase.updateDay(day);
      return { response: response, origemDados: "Local" }
    }

    const responseData: DayType = {
      data_dia_producao: request.data.data_dia_producao,
      id_dia: request.data.id_dia,
      id_pessoa: request.id_pessoa
    }

    await getDay(day.id_pessoa)

    return { response: responseData, origemDados: "Remoto" };
  }

  async function deleteDay(day: DayType) {
    const url = `${baseUrl}/dia/${day.id_dia}`

    const request: any = await axios.delete(url).catch(function (error) {
      return { status: 571 }
    });

    if (request.status === 571) {
      await pendingOperationDatabase.postPendingOperation({ metodo: "DELETE", url: url });
      const request = await dayDatabase.deleteDay(day);
      return { response: request, origemDados: "Local" }
    }

    await getDay(day.id_pessoa)
    await getProduct()
    await getProduction(day.id_dia)
    return { response: request.data.items, origemDados: "Remoto" };
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

  async function updateProduct(data_inicio: string, product: ProductType) {
    const url = `${baseUrl}/produto/${product.id_produto}`

    const body = JSON.stringify({
      "cod_referencia": product.cod_referencia,
      "data_modificado": product.data_modificado,
      "descricao": product.descricao?.trim(),
      "modificado_por": product.modificado_por,
      "nome": product.nome?.trim(),
      "preco": product.preco || 0,
      "tempo_minuto": product.tempo_minuto,
      "ultimo_valor": product.ultimo_valor,
      "data_inicio": data_inicio
    })

    const response: any = await axios.put(url, body).catch(function (error) {
      return { status: 571 }
    });

    if (response.status === 571) {
      await pendingOperationDatabase.postPendingOperation({ metodo: "PUT", url: url, body: body });

      const response = await productDatabase.updateProduct(product, data_inicio)

      return { response: response, origemDados: "Local" }
    }

    await getProduct()

    return { response: response.data.items, origemDados: "Remoto" };
  }

  async function deleteProduct(id_produto: string) {
    const url = `${baseUrl}/produto/${id_produto}`

    const request: any = await axios.delete(url).catch(function (error) {
      return { status: 571 }
    });

    if (request.status === 571) {
      await pendingOperationDatabase.postPendingOperation({ metodo: "DELETE", url: url });
      const request = await productDatabase.deleteProduct(id_produto);
      return { response: request, origemDados: "Local" }
    }

    await getProduct()

    return { response: request.data.items, origemDados: "Remoto" };
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

    const url = `${baseUrl}/producao/${production.id_producao}?id_dia=${production.id_dia}&id_produto=${production.id_produto}&quantidade=${production.quantidade}&observacao=${production.observacao.replace(/(?:\r\n|\r|\n)/g, "\n")}`

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

  async function updateProduction(production: ProductionType) {
    const url = `${baseUrl}/producao/${production.id_producao}`

    const body = JSON.stringify({
      "id_dia": production.id_dia,
      "id_produto": production.id_produto,
      "quantidade": production.quantidade,
      "observacao": production.observacao?.trim()
    })

    const response: any = await axios.put(url, body).catch(function (error) {
      return { status: 571 }
    });

    if (response.status === 571) {

      await pendingOperationDatabase.postPendingOperation({ metodo: "PUT", url: url, body: body });

      const response = await productionDatabase.updateProduction(production)

      return { response: response, origemDados: "Local" }
    }

    await getProduction(production.id_dia)

    return { response: response.data.items, origemDados: "Remoto" };
  }

  async function deleteProduction(production: ProductionType) {
    const url = `${baseUrl}/producao/${production.id_producao}`

    const request: any = await axios.delete(url).catch(function (error) {
      return { status: 571 }
    });

    if (request.status === 571) {
      await pendingOperationDatabase.postPendingOperation({ metodo: "DELETE", url: url });
      const request = await productionDatabase.deleteProduction(production.id_producao);
      return { response: request, origemDados: "Local" }
    }

    await getProduction(production.id_dia)

    return { response: request.data.items, origemDados: "Remoto" };
  }

  async function getPayment(id_pessoa?: number) {
    const requestRemote = await getPaymentRemote(id_pessoa)

    if (requestRemote.status === 571) {
      const request = await paymentDatabase.getPayment(id_pessoa)
      return { response: request, origemDados: "Local" }
    }
    await paymentDatabase.updatePaymentList(requestRemote.data.items, id_pessoa)

    const localData = await paymentDatabase.getPayment(id_pessoa)

    return { response: localData, origemDados: "Remoto" };
  }

  async function getPendingPayment(id_pessoa?: number) {
    const response = await getPendingRemote(id_pessoa);

    if (response.status === 571) {
      const response = await paymentDatabase.getPendingPayment(id_pessoa)
      setMessage("Os dados foram resgatados localmente, eles podem estar desatualizados, por favor, verifique sua conexão")
      setTimeout(() => {
        setMessage("")
      }, 3500);
      return { response: response, origemDados: "Local" }
    }

    return { response: response.data.items, origemDados: "Remoto" };
  }

  async function postPayment(payment: PaymentType) {
    const url = `${baseUrl}/pagamento/?id_pagamento=${payment.id_pagamento}&id_pessoa=${payment.id_pessoa}&data_pagamento=${payment.data_pagamento}&valor_pagamento=${payment.valor_pagamento}`

    const request: any = await axios.post(url).catch(function (error) {
      return { status: 571 }
    });

    if (request.status === 571) {
      await pendingOperationDatabase.postPendingOperation({ metodo: "POST", url: url });
      const request = await paymentDatabase.postPayment(payment);
      return { response: request, origemDados: "Local" }
    }

    return { response: request.data.items, origemDados: "Remoto" };
  }

  async function deletePayment(id_payment: string) {
    const url = `${baseUrl}/pagamento/${id_payment}`

    const request: any = await axios.delete(url).catch(function (error) {
      return { status: 571 }
    });

    if (request.status === 571) {
      await pendingOperationDatabase.postPendingOperation({ metodo: "DELETE", url: url });
      const request = await paymentDatabase.deletePayment(id_payment);
      return { response: request, origemDados: "Local" }
    }

    await getPayment()

    return { response: request.data.items, origemDados: "Remoto" };
  }

  return (
    <SyncContext.Provider value={{ deletePayment, postPayment, getPayment, deleteDay, updateDay, deleteProduct, deleteProduction, postProduction, getProduction, updateProduction, updateProduct, updateHourValue, setIsConnected, isConnected, syncData, postProduct, getProduct, getPeople, getDay, postDay, getPendingPayment, getHourValue, nanoid }}>
      <>
        {children}
        {
          message &&
          <View
            style={{
              position: 'absolute',
              top: 60,
              right: 8,
              left: 8,
              // width: "100%",
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: colors.text,
                padding: 12,
                backgroundColor: colors.backgroundSecundary,
                borderRadius: 8
              }}
            >
              {message}
            </Text>
          </View>
        }
      </>
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