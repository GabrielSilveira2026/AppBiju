import { Redirect, router, Slot, Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, View } from "react-native";
import { IMAGE_PATHS } from "../constants/constants";
import { globalStyles } from "@/styles/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

export default function RootLayout() {
  return (
    <AuthProvider>
      <View style={{ flex: 1 }}>
        <StatusBar style="light" />
        <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
          <Slot />
        </ImageBackground>
      </View>
    </AuthProvider>
  );
}
