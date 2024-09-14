import { useAuthContext } from "../../../contexts/AuthContext";
import { Redirect, Tabs } from "expo-router";
import { StatusBar, Text, View } from "react-native";

export default function AppLayout() {
  const { isAuthenticated, user } = useAuthContext();

  return (
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: "Produtos"
          }}
        />
      </Tabs>
  );
}
