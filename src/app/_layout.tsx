import { Slot, Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { StatusBar } from "expo-status-bar";
import { ImageBackground } from "react-native";
import { IMAGE_PATHS } from "../constants/constants";
import { globalStyles } from "@/styles/styles";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
        <StatusBar style="dark" />
        <Slot />
      </ImageBackground>
    </AuthProvider>
  );
}
