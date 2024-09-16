import { useAuthContext } from "@/src/contexts/AuthContext";
import { Button, Text, View } from "react-native";

export default function Profile() {
  const { signIn, signOut, isAuthenticated } = useAuthContext()
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Perfil</Text>
    </View>
  );
}
