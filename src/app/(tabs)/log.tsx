import usePendingPaymentDatabase from '@/src/database/usePendingPaymentDatabase';
import usePeopleDatabase from '@/src/database/usePeopleDatabase';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native'

export default function log() {
    const pendingPaymentDatabase = usePendingPaymentDatabase();
    const usePeople = usePeopleDatabase()
    const [listPendingPayment, setListPendingPayment ] = useState([])

    async function getTablePendingPayment() {
        const response = await usePeople.getPeople()
        
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
                  <Text>id_pagamento {item.email}</Text>
                  <Text>id_pessoa {item.id_pessoa}</Text>
                  <Text>nome {item.nome}</Text>
                  <Text>ultimo_pagamento {item.id_pessoa}</Text>
                  <Text>total {item.id_perfil}</Text>
                </View>
              )
            }
          />
        </View>
    )
}