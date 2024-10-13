import Button from '@/src/components/Button';
import { useAuthContext } from '@/src/contexts/AuthContext';
import useDayDatabase from '@/src/database/useDayDatabase';
import useParamDatabase from '@/src/database/useParamDatabase';
import usePendingOperationDatabase from '@/src/database/usePendingOperationDatabase';
import usePendingPaymentDatabase from '@/src/database/usePendingPaymentDatabase';
import usePeopleDatabase from '@/src/database/usePeopleDatabase';
import useProductDatabase from '@/src/database/useProductDatabase';
import { useIsFocused } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

export default function log() {
  const pendingPaymentDatabase = usePendingPaymentDatabase();
  const usePeople = usePeopleDatabase()
  const productDatabase = useProductDatabase();
  const peopleDatabase = usePeopleDatabase();
  const dayDatabase = useDayDatabase();
  const paramDatabase = useParamDatabase();
  const pendingOperationDatabase = usePendingOperationDatabase()


  const [listPendingPayment, setListPendingPayment] = useState([])

  const { signIn, signOut, isAuthenticated } = useAuthContext()
  const database = useSQLiteContext()

  async function logout() {
    const tables = await database.getAllAsync(`SELECT name FROM sqlite_master WHERE type='table'`);
    for (const table of tables) {
      await database.execAsync(`DELETE FROM ${table.name}`);
    }
    signOut()
  }

  async function getTable() {
    const response = await pendingOperationDatabase.getPendingOperation()

    setListPendingPayment(response)
  }


  const isFocused = useIsFocused();
  useEffect(() => {
    getTable()
  }, [isFocused])

  return (
    <SafeAreaView>
      <ScrollView>
        <Text>Vc esta esta logado</Text>
        <Button onPress={logout} title={"Sign Out"} style={{backgroundColor: "black"}}/>
        {/* <FlatList
        data={listPendingPayment}
        keyExtractor={item => item.id_pessoa}
        renderItem={
          ({ item }) => (
            <View style={{ marginTop: 30 }}>
              <Text>id_pagamento {item.email}</Text>
              <Text>id_pessoa {item.id_pessoa}</Text>
              <Text>nome {item.nome}</Text>
              <Text>ultimo_pagamento {item.id_pessoa}</Text>
              <Text>total {item.id_perfil}</Text>
            </View>
          )
        }
      /> */}
        <Text>
          {JSON.stringify(listPendingPayment, 0, 2)}
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}