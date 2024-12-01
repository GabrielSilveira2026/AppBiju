import AddContainer from '@/src/components/AddContainer'
import CardPayment from '@/src/components/Payment/CardPayment'
import { constants } from '@/src/constants/constants'
import { useAuthContext } from '@/src/contexts/AuthContext'
import { useSync } from '@/src/contexts/SyncContext'
import { PaymentType } from '@/src/types/types'
import { colors } from '@/styles/color'
import { IMAGE_PATHS } from '@/styles/constants'
import { globalStyles } from '@/styles/styles'
import { Ionicons } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, ImageBackground, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Payment() {
  const { user } = useAuthContext();
  const { id_pessoa } = useLocalSearchParams();
  const isFocused = useIsFocused();
  const sync = useSync()

  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [paymentList, setPaymentList] = useState<PaymentType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  async function getPayment(id_pessoa?: number) {
    setIsAdding(true)
    setIsLoading(true)
    const request = await sync.getPayment(id_pessoa)
    setPaymentList(request.response)
    setIsAdding(false)
    setIsLoading(false)
  }

  useEffect(() => {

    if (isFocused) {
      getPayment(Number(id_pessoa))
    }
    else {
      setIsAdding(false)
    }
  }, [isFocused])


  async function handleCreatePayment() {
    if (!isAdding) {
      setIsAdding(true)
      const request = await sync.getPendingPayment()
      if (request.origemDados === "Remoto") {
        const newPayment: PaymentType = {
          id_pagamento: "",
          data_pagamento: (new Date()).toISOString(),
          id_pessoa: Number(id_pessoa) || 0,
          valor_pagamento: 0,
          nome: ""
        };
        setPaymentList((prevPaymentList) => [newPayment, ...prevPaymentList]);
      }
      else {
        Alert.alert("Falha na conexão", "Ocorreu uma falha na conexão ao consultar os pagamentos pendentes, por favor, verifique sua conexão")
      }
      setIsAdding(false)
    }
    else {
      setIsAdding(false)
    }
  }

  async function handleSavePayment(payment: PaymentType) {
    setIsAdding(true)

    if (payment.id_pagamento === "") {
      payment.id_pagamento = sync.nanoid()
      let localDate = new Date(payment.data_pagamento)
      localDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
      payment.data_pagamento = localDate.toISOString();

      const request = await sync.postPayment(payment)
      setPaymentList((prevPaymentList) => [payment, ...prevPaymentList]);

      setPaymentList((prevPaymentList) => prevPaymentList.filter(payment => payment.id_pagamento !== ""));
    }

    setIsAdding(false)
  }

  function handleCancelPayment(paymentId: string) {
    setIsAdding(false)
    setPaymentList((prevPaymentList) => prevPaymentList.filter((payment) => payment.id_pagamento !== paymentId));
  }

  async function handleDeletePayment(id_payment: string) {
    await sync.deletePayment(id_payment)
    setPaymentList((prevPaymentList) => prevPaymentList.filter(payment => payment.id_pagamento !== id_payment));
  }

  return (
    <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
      <SafeAreaView style={globalStyles.pageContainer}>
        <View style={[globalStyles.container, styles.paymentContainer]}>
          <View style={styles.titleContainer}>
            <TouchableOpacity
              onPress={() => {
                if (id_pessoa) {
                  router.navigate({ pathname: "/", params: { id_pessoa: id_pessoa } })
                } else {
                  router.navigate("/");
                }
              }}
            >
              <Ionicons
                name="arrow-back-outline"
                size={35}
                color={colors.primary}
              />
            </TouchableOpacity>

            <Text style={globalStyles.title}>Pagamentos</Text>
            <ActivityIndicator animating={isLoading} style={{ marginLeft: "auto" }} color={colors.primary} />

            {/* <Input
              value=""
              placeholder="Pesquisar"
              onChangeText={() => { }}
            /> */}
          </View>
          <FlatList
            data={paymentList}
            refreshing={false}
            onRefresh={() => {
              getPayment()
            }}
            contentContainerStyle={{ gap: 8 }}
            keyExtractor={(item) => item.id_pagamento}
            keyboardShouldPersistTaps='handled'
            renderItem={({ item }) => (
              <CardPayment
                mode={item.id_pagamento ? "view" : "create"}
                payment={item}
                onSave={handleSavePayment}
                onCancel={() => handleCancelPayment(item.id_pagamento)}
                onDelete={() => handleDeletePayment(item.id_pagamento)}
              />
            )}
          />
          {
            user?.id_perfil !== constants.perfil.funcionario.id_perfil &&
            <AddContainer
              disable={isAdding}
              onPress={handleCreatePayment}
              text="Adicionar Pagamento"
            />
          }
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  paymentContainer: {
    flex: 1,
    flexGrow: 1,
  },
  titleContainer: {
    padding: 8,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
})