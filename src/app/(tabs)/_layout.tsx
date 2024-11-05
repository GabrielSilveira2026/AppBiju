
import { useAuthContext } from "../../contexts/AuthContext";
import { Redirect, router, Tabs } from "expo-router";
import Loading from "../../components/Loading";
import { colors } from "@/styles/color";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { constants } from "@/src/constants/constants";

export default function AppLayout() {
  const { isLoading, isAuthenticated, user } = useAuthContext();

  if (isLoading) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return <Redirect href={"/login"} />
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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          href: user?.id_perfil !== constants.perfil.administrador.id_perfil ? `/?${user?.id_pessoa}` : null,
          tabBarIcon: () => <Ionicons name="person-outline" size={35} color={colors.primary} />
        }}
      />
      <Tabs.Screen
        name="employees"
        options={{
          headerShown: false,
          href: user?.id_perfil !== constants.perfil.funcionario.id_perfil ? "/employees" : null,
          tabBarIcon: () => <Ionicons name="people-outline" size={35} color={colors.primary} />
        }}
      />
      <Tabs.Screen
        name="product"
        options={{
          headerShown: false,
          tabBarIcon: () => <Ionicons name="pricetags-outline" size={35} color={colors.primary} />,
        }}
      />
      <Tabs.Screen
        name="day"
        options={{
          href: null,
          headerShown: false,
          tabBarIcon: () => <Ionicons name="calendar-outline" size={35} color={colors.primary} />,
        }}
      />
      <Tabs.Screen
        name="payment"
        options={{
          headerShown: false,
          href: user?.id_perfil === constants.perfil.funcionario.id_perfil ? `/payment?${user?.id_pessoa}` : "/payment",
          tabBarIcon: () => <Ionicons name="cash-outline" size={35} color={colors.primary} />
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          headerShown: false,
          href: user?.id_perfil === constants.perfil.suporte.id_perfil ? "/log" : null,
          tabBarIcon: () => <Ionicons name="document-text-outline" size={35} color={colors.primary} />
        }}
      />

    </Tabs>
  );
}
