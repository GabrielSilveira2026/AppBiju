import { Input } from '@/src/components/Input'
import CardPayment from '@/src/components/Payment/CardPayment'
import { useSync } from '@/src/contexts/SyncContext'
import { getPayment } from '@/src/httpservices/payment'
import { PaymentType } from '@/src/types/types'
import { colors } from '@/styles/color'
import { IMAGE_PATHS } from '@/styles/constants'
import { globalStyles } from '@/styles/styles'
import { Ionicons } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, ImageBackground, StyleSheet, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Payment() {
  const { id_pessoa } = useLocalSearchParams();
  const isFocused = useIsFocused();
  const sync = useSync()
  const controller = new AbortController();

  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [paymentList, setPaymentList] = useState<PaymentType[]>([])

  useEffect(() => {
    async function getPayment(id_pessoa?: number) {
      const request = await sync.getPayment(id_pessoa)
      console.log(request)
      setPaymentList(request.response)
    }
    
    if (isFocused) {
      console.log(id_pessoa);
      getPayment(Number(id_pessoa) || undefined)
    }

    return () => {
      if (!isFocused) {
        setPaymentList([])
        setIsAdding(false)
      }
      controller.abort();
    };
  }, [isFocused])


  return (
    <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
      <SafeAreaView style={globalStyles.pageContainer}>
        <View style={[globalStyles.container, styles.paymentContainer]}>
          <View style={styles.titleContainer}>
            <Ionicons
              onPress={() => {
                router.navigate("/");
              }}
              name="arrow-back-outline"
              size={35}
              color={colors.primary}
            />
            <Text style={globalStyles.title}>Pagamentos</Text>
            <Input
              value=""
              placeholder="Pesquisar"
              onChangeText={() => { }}
            />
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
              <CardPayment payment={item} />
            )}
          />
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