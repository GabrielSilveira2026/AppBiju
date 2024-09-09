import { useAuthContext } from "@/src/contexts/AuthContext";
import { Button, Text, View } from "react-native";

export default function HomeScreen() {
  const { signIn, signOut, isAuthenticated } = useAuthContext()
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bem-vindo à página inicial!</Text>
      <Button onPress={isAuthenticated ? signOut : signIn} title={isAuthenticated ? "Sign Out" : "Sign in"}></Button>
    </View>
  );
}
