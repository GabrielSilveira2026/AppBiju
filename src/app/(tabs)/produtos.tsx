import { useAuthContext } from "@/src/contexts/AuthContext";
import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Produtos() {
  const { signIn, signOut, isAuthenticated } = useAuthContext()

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Vc esta esta logado</Text>
      <Button onPress={signOut} title={"Sign Out"}></Button>
    </View>
  );
}
