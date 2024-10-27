import Button from '@/src/components/Button';
import { useAuthContext } from '@/src/contexts/AuthContext';
import useDayDatabase from '@/src/database/useDayDatabase';
import useParamDatabase from '@/src/database/useParamDatabase';
import usePendingOperationDatabase from '@/src/database/usePendingOperationDatabase';
import usePendingPaymentDatabase from '@/src/database/usePendingPaymentDatabase';
import usePeopleDatabase from '@/src/database/usePeopleDatabase';
import useProductDatabase from '@/src/database/useProductDatabase';
import useProductionDatabase from '@/src/database/useProductionDatabase';
import { useIsFocused } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-get-random-values'
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdef', 10)

export default function log() {
  const pendingPaymentDatabase = usePendingPaymentDatabase();
  const usePeople = usePeopleDatabase()
  const productDatabase = useProductDatabase();
  const productionDatabase = useProductionDatabase();
  const peopleDatabase = usePeopleDatabase();
  const dayDatabase = useDayDatabase();
  const paramDatabase = useParamDatabase();
  const pendingOperationDatabase = usePendingOperationDatabase()


  const [log1, setLog1] = useState([])
  const [log2, setLog2] = useState([])
  const [log3, setLog3] = useState([])
  const [log4, setLog4] = useState([])
  const [log5, setLog5] = useState([])

  const { signIn, signOut, isAuthenticated } = useAuthContext()
  const database = useSQLiteContext()

  async function logout() {
    const tables = await database.getAllAsync(`SELECT name FROM sqlite_master WHERE type='table'`);
    for (const table of tables) {
      await database.execAsync(`DELETE FROM ${table.name}`);
    }
    signOut()
  }

  async function cleanData() {
    const tables = await database.getAllAsync(`SELECT name FROM sqlite_master WHERE type='table'`);
    for (const table of tables) {
      await database.execAsync(`DELETE FROM ${table.name}`);
    }

    setLog1([])
    setLog2([])
    setLog3([])
    setLog4([])
    setLog5([])
  }

  async function getTable() {
    let response = await productDatabase.getProduct()
    setLog1(response)

    response = await productionDatabase.getProduction('66dffa')
    setLog2(response)

    response = await peopleDatabase.getPeople()
    setLog3(response)

    response = await dayDatabase.getDay()
    setLog4(response)

    response = await pendingOperationDatabase.getPendingOperation()
    setLog5(response)

  }

  function geraID() {

    const teste = nanoid()
    console.log(teste)

  }

  const isFocused = useIsFocused();
  useEffect(() => {
    getTable()
  }, [isFocused])

  return (
    <SafeAreaView>
      <ScrollView>
        <Text>Vc esta esta logado</Text>
        <Button onPress={logout} title={"Sign Out"} style={{ backgroundColor: "black" }} />
        <Button onPress={cleanData} title={"Limpar tabelas"} style={{ backgroundColor: "black" }} />
        <Button onPress={geraID} title={"Gera ID"} style={{ backgroundColor: "black" }} />
        <Text>
          Produtos:{JSON.stringify(log1, 0, 2)}
          {"\n"}

          Producoes:{JSON.stringify(log2, 0, 2)}
          {"\n"}

          Pessoas:{JSON.stringify(log3, 0, 2)}
          {"\n"}

          Dias:{JSON.stringify(log4, 0, 2)}
          {"\n"}

          Operacoes:{JSON.stringify(log5, 0, 2)}
          {"\n"}
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}