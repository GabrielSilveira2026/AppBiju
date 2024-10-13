
import { useAuthContext } from "../../contexts/AuthContext";
import { Redirect, router, Tabs } from "expo-router";
import Loading from "../../components/Loading";
import { colors } from "@/styles/color";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

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
          href: user?.perfil === "Funcionario" ? `/?${user?.id_pessoa}` : null,
          tabBarIcon: () => <Ionicons name="person-outline" size={35} color={colors.primary} />
        }}
      />
      <Tabs.Screen
        name="produtos"
        options={{
          headerShown: false,
          tabBarIcon: () => <Ionicons name="pricetags-outline" size={35} color={colors.primary} />,
        }}
      />
      <Tabs.Screen
        name="day"
        options={{
          headerShown: false,
          tabBarIcon: () => <Ionicons name="calendar-outline" size={35} color={colors.primary} />,
        }}
      />
      <Tabs.Screen
        name="employees"
        options={{
          headerShown: false,
          href: user?.perfil === "Administrador" || user?.perfil === "Suporte" ? "/employees" : null,
          tabBarIcon: () => <Ionicons name="people-outline" size={35} color={colors.primary} />
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          headerShown: false,
          // href: user?.perfil === "Administrador" || user?.perfil === "Suporte" ? "/employees" : null,
          tabBarIcon: () => <Ionicons name="document-text-outline" size={35} color={colors.primary} />
        }}
      />
    </Tabs>
  );
}
