import { useAuthContext } from "../../contexts/AuthContext";
import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function Layout() {
  const { isAuthenticated, user } = useAuthContext();

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen
        name="produtos"
        options={{
          title: "Produtos",
          href: user?.id_perfil === 1 ? null : "./produtos"

        }}
      />
      <Tabs.Screen
        name="teste"
        options={{
          title: "Teste",
          href: user?.id_perfil === 1 ? "./teste" : null
        }}
      />
    </Tabs>
  );
}
