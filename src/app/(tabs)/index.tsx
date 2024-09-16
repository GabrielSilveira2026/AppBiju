import { useAuthContext } from "@/src/contexts/AuthContext";
import { Button, Text, View } from "react-native";

export default function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Perfil</Text>
    </View>
  );
}
