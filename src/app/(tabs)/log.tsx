import Button from '@/src/components/Button';
import { useAuthContext } from '@/src/contexts/AuthContext';
import usePendingPaymentDatabase from '@/src/database/usePendingPaymentDatabase';
import usePeopleDatabase from '@/src/database/usePeopleDatabase';
import { useIsFocused } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native'

export default function log() {
  const pendingPaymentDatabase = usePendingPaymentDatabase();
  const usePeople = usePeopleDatabase()
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
  async function getTablePendingPayment() {
    const response = await usePeople.getPeople()

    setListPendingPayment(response)
  }


  const isFocused = useIsFocused();
  useEffect(() => {
    getTablePendingPayment()
  }, [isFocused])

  return (
    <View>
      <Text>Vc esta esta logado</Text>
      <Button onPress={logout} title={"Sign Out"}></Button>
      <FlatList
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
      />
    </View>
  )
}