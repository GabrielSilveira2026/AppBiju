import { useAuthContext } from "@/src/contexts/AuthContext";
import { Button, Text, View } from "react-native";

export default function ProdutosScreen() {
  const { signIn, signOut, isAuthenticated } = useAuthContext()
  
  return (
    <View>
      <Text>Vc esta esta logado</Text>
      <Button onPress={isAuthenticated ? signOut : signIn} title={isAuthenticated ? "Sign Out" : "Sign in"}></Button>
    </View>
  );
}
