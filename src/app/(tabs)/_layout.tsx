import { useAuthContext } from "../../contexts/AuthContext";
import { Redirect, Tabs } from "expo-router";
import { StatusBar, Text, View } from "react-native";

export default function AppLayout() {
  const { isAuthenticated, user } = useAuthContext();

  if (!isAuthenticated) {
    return <Redirect href="../" />;
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="produtos"
        options={{
          title: "Produtos",
          href: "./produtos"
        }}
      />
      <Tabs.Screen
        name="teste"
        options={{
          title: "Teste",
          href: "./teste"
        }}
      />
    </Tabs>
  );
}
