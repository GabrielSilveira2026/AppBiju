import Button from '@/src/components/Button';
import { useAuthContext } from '@/src/contexts/AuthContext';
import useDayDatabase from '@/src/database/useDayDatabase';
import useParamDatabase from '@/src/database/useParamDatabase';
import usePendingOperationDatabase from '@/src/database/usePendingOperationDatabase';
import usePeopleDatabase from '@/src/database/usePeopleDatabase';
import useProductDatabase from '@/src/database/useProductDatabase';
import useProductionDatabase from '@/src/database/useProductionDatabase';
import { useIsFocused } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, ScrollView, TouchableOpacity, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-get-random-values'
import { customAlphabet } from 'nanoid'
import { TimerPickerModal } from "react-native-timer-picker";
import { Input } from '@/src/components/Input';
import { formatMinutesToHours } from '@/src/utils/utils';
import HourContainer from '@/src/components/Products/HourContainer';
import usePaymentDatabase from '@/src/database/usePaymentDatabase';
import { Ionicons } from '@expo/vector-icons';
import { useSync } from '@/src/contexts/SyncContext';
const nanoid = customAlphabet('1234567890abcdef', 10)

export default function log() {
  const usePeople = usePeopleDatabase()
  const sync = useSync()
  const productDatabase = useProductDatabase();
  const paymentDatabase = usePaymentDatabase();
  const productionDatabase = useProductionDatabase();
  const peopleDatabase = usePeopleDatabase();
  const dayDatabase = useDayDatabase();
  const pendingOperationDatabase = usePendingOperationDatabase()

  const [log1, setLog1] = useState([])
  const [log2, setLog2] = useState([])
  const [log3, setLog3] = useState([])
  const [log4, setLog4] = useState([])
  const [log5, setLog5] = useState([])
  const [log6, setLog6] = useState([])

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

    response = await productionDatabase.getProduction()
    setLog2(response)

    response = await paymentDatabase.getPayment()
    setLog3(response)

    response = await dayDatabase.getDay()
    setLog4(response)

    response = await pendingOperationDatabase.getPendingOperation()
    setLog5(response)

    response = await peopleDatabase.getPeople()
    setLog6(response)

  }

  function geraID() {

    const teste = nanoid()
    console.log(teste)

  }

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      getTable()
    }
    else {
      setLog1([])
      setLog2([])
      setLog3([])
      setLog4([])
      setLog5([])
      setLog6([])
    }
  }, [isFocused])

  const [showPicker, setShowPicker] = useState(false);
  const [alarmString, setAlarmString] = useState<
    string
  >("");

  function formatTimer({ hours, minutes, seconds }: { hours: number, minutes: number, seconds: number }) {
    const tempo = String((hours * 60) + (minutes))
    setAlarmString(tempo)
  }

  function LogComponent({ titulo, log }: { titulo: String, log: String }) {
    const [showDetails, setShowDetails] = useState<boolean>(false)
    return (
      <View style={{ backgroundColor: "#CCC", margin: 10 }}>
        <Text>{titulo}</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1 }}>
            {
              showDetails &&
              <Text>
                {log}
              </Text>
            }
          </View>
          <TouchableOpacity style={{ backgroundColor: "#BBB", justifyContent: "center" }} onPress={() => setShowDetails(!showDetails)}>
            <Ionicons name={showDetails ? "eye-off" : "eye"} size={30} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <Button onPress={cleanData} title={"Limpar tabelas"} style={{ backgroundColor: "black" }} />
        <Button onPress={sync.syncData} title={"Sync"} style={{ backgroundColor: "black" }} />

        <LogComponent titulo={"Produtos"} log={JSON.stringify(log1, 0, 2)} />
        <LogComponent titulo={"Producoes"} log={JSON.stringify(log2, 0, 2)} />
        <LogComponent titulo={"Pessoa"} log={JSON.stringify(log6, 0, 2)} />
        <LogComponent titulo={"Payment"} log={JSON.stringify(log3, 0, 2)} />
        <LogComponent titulo={"Dias"} log={JSON.stringify(log4, 0, 2)} />
        <LogComponent titulo={"Operacoes Pendentes"} log={JSON.stringify(log5, 0, 2)} />

        {/* <Text>
          Produtos:{JSON.stringify(log1, 0, 2)}
          {"\n"}

          Producoes:{JSON.stringify(log2, 0, 2)}
          {"\n"}

          Pessoa:{JSON.stringify(log6, 0, 2)}
          {"\n"}

          Payment:{JSON.stringify(log3, 0, 2)}
          {"\n"}

          Dias:{JSON.stringify(log4, 0, 2)}
          {"\n"}

          Operacoes:{JSON.stringify(log5, 0, 2)}
          {"\n"}
        </Text> */}
      </ScrollView>
    </SafeAreaView>
  )
}