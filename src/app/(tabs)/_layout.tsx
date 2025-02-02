
import { useAuthContext } from "../../contexts/AuthContext";
import { Redirect, router, Tabs } from "expo-router";
import Loading from "..";
import { colors } from "@/styles/color";
import { Ionicons } from "@expo/vector-icons";
import { constants } from "@/src/constants/constants";

export default function AppLayout() {
  const { isLoading, user } = useAuthContext();

  if (isLoading) {
    return <Loading />
  }

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "black",
          borderTopColor: colors.primary,
          borderTopWidth: 1,
          minHeight: 40,
          paddingVertical: 8,
        },
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: user?.id_perfil !== constants.perfil.administrador.id_perfil ? `/?${user?.id_pessoa}` : null,
          tabBarIcon: ({ focused }) =>
            <Ionicons
              name="person-outline"
              size={focused ? 40 : 35}
              color={colors.primary}
              style={{ opacity: focused ? 1 : 0.5 }}
            />
        }}
      />
      <Tabs.Screen
        name="employees"
        options={{
          href: user?.id_perfil !== constants.perfil.funcionario.id_perfil ? "/employees" : null,
          tabBarIcon: ({ focused }) =>
            <Ionicons
              name="people-outline"
              size={focused ? 40 : 35}
              color={colors.primary}
              style={{ opacity: focused ? 1 : 0.5 }}
            />
        }}
      />
      <Tabs.Screen
        name="day"
        options={{
          href: null,
          tabBarIcon: ({ focused }) =>
            <Ionicons
              name="calendar-outline"
              size={focused ? 40 : 35}
              color={colors.primary}
              style={{ opacity: focused ? 1 : 0.5 }}
            />,
        }}
      />
      <Tabs.Screen
        name="product"
        options={{
          href: "/product",
          tabBarIcon: ({ focused }) =>
            <Ionicons
              name="pricetags-outline"
              size={focused ? 40 : 35}
              color={colors.primary}
              style={{ opacity: focused ? 1 : 0.5 }}
            />,
        }}
      />
      <Tabs.Screen
        name="payment"
        options={{
          href: user?.id_perfil === constants.perfil.funcionario.id_perfil ? `/payment?id_pessoa=${user?.id_pessoa}` : "/payment",
          tabBarIcon: ({ focused }) =>
            <Ionicons
              name="cash-outline"
              size={focused ? 40 : 35}
              color={colors.primary}
              style={{ opacity: focused ? 1 : 0.5 }}
            />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: user?.id_perfil !== constants.perfil.funcionario.id_perfil ? "/profile" : null,
          tabBarIcon: ({ focused }) =>
            <Ionicons
              name="person-outline"
              size={focused ? 40 : 35}
              color={colors.primary}
              style={{ opacity: focused ? 1 : 0.5 }}
            />
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          href: user?.id_perfil === constants.perfil.suporte.id_perfil ? "/log" : null,
          tabBarIcon: ({ focused }) =>
            <Ionicons
              name="document-text-outline"
              size={focused ? 40 : 35}
              color={colors.primary}
              style={{ opacity: focused ? 1 : 0.5 }}
            />
        }}
      />
    </Tabs>
  );
}
