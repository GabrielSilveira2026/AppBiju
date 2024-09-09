import { useAuthContext } from "@/src/contexts/AuthContext";
import { Text, View } from "react-native";

export default function Teste() {

  const { user } = useAuthContext();
  

  return (
    <View>
      <Text>Vc esta logado {user?.nome}, como {user?.perfil}</Text>
    </View>
  );
}
