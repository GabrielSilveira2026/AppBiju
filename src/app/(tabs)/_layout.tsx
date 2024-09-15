import Loading from "@/src/components/Loading";
import { useAuthContext } from "../../contexts/AuthContext";
import { Redirect, Tabs } from "expo-router";
import { StatusBar, Text, View } from "react-native";

export default function AppLayout() {
  const { isLoading, isAuthenticated, user } = useAuthContext();

  if (isLoading) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return <Redirect href={"/login"} />
  }


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
