import usePendingPayment from '@/src/database/usePendingPayment';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native'

export default function log() {
    const pendingPaymentDatabase = usePendingPayment();

    const [listPendingPayment, setListPendingPayment ] = useState([])

    async function getTablePendingPayment() {
        const response = await pendingPaymentDatabase.getPendingPayment()
        setListPendingPayment(response)
    }


    const isFocused = useIsFocused();
    useEffect(() => {
        getTablePendingPayment()
    },[isFocused])

    return (
        <View>
            <FlatList
            data={ listPendingPayment}
            keyExtractor={item => item.id_pessoa}
            renderItem={
              ({ item }) => (
                <View style={{marginTop: 30}}>
                  <Text>id_pagamento {item.id_pagamento}</Text>
                  <Text>id_pessoa {item.id_pessoa}</Text>
                  <Text>nome {item.nome}</Text>
                  <Text>ultimo_pagamento {item.ultimo_pagamento}</Text>
                  <Text>total {item.total}</Text>
                </View>
              )
            }
          />
        </View>
    )
}