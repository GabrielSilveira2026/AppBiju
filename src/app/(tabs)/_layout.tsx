
import { useAuthContext } from "../../contexts/AuthContext";
import { Redirect, router, Tabs } from "expo-router";
import Loading from "../../components/Loading";

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
        name="employees"
        options={{
          title: "Funcionarios"
        }}
      />
      <Tabs.Screen
        name="produtos"
        options={{
          title: "Produtos"
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Perfil"
        }}
      />
    </Tabs>
  );
}
