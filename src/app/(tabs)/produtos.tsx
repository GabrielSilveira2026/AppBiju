import { useAuthContext } from "@/src/contexts/AuthContext";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Button, Text, View } from "react-native";

export default function Produtos() {
  const { signIn, signOut, isAuthenticated } = useAuthContext()
  const database = useSQLiteContext()

  async function logout() {
    const tables = await database.getAllAsync(`SELECT name FROM sqlite_master WHERE type='table'`);
    for (const table of tables) {
      await database.execAsync(`DELETE FROM ${table.name}`);
    }    
    signOut()
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Vc esta esta logado</Text>
      <Button onPress={logout} title={"Sign Out"}></Button>
    </View>
  );
}
