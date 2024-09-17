
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
          title: "Funcionarios",
          headerShown: false,
          href: user?.perfil === "Administrador" || user?.perfil === "Suporte" ? "/employees" : null
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Perfil",
          headerShown: false,
          href: user?.perfil === "Funcionario" ? "/" : null
        }}
      />
      <Tabs.Screen
        name="produtos"
        options={{
          title: "Produtos",
          headerShown: false
        }}
      />
    </Tabs>
  );
}
