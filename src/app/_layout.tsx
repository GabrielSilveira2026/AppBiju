import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { initializeDatabase } from "@/src/database/initializeDatabase";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, Text, View } from "react-native";
import { IMAGE_PATHS } from "../../styles/constants";
import { globalStyles } from "@/styles/styles";
import { SQLiteProvider } from "expo-sqlite";
import { SyncProvider, useSync } from "../contexts/SyncContext";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="myDataBase.db" onInit={initializeDatabase}>
      <AuthProvider>
        <SyncProvider>
          <StatusBar style="light" />
          <ImageBackground source={IMAGE_PATHS.backgroundImage} style={[globalStyles.backgroundImage]}>
            <Slot />
          </ImageBackground>
        </SyncProvider>
      </AuthProvider>
    </SQLiteProvider>
  );
}
