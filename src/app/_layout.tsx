import { Slot } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { initializeDatabase } from "@/src/database/initializeDatabase";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, View } from "react-native";
import { IMAGE_PATHS } from "../../styles/constants";
import { globalStyles } from "@/styles/styles";
import { SQLiteProvider } from "expo-sqlite";
import { SyncProvider } from "../contexts/SyncContext";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="myDataBase.db" onInit={initializeDatabase}>
      <SyncProvider>
        <AuthProvider>
          <View style={{ flex: 1 }}>
            <StatusBar style="light" />
            <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
              <Slot />
            </ImageBackground>
          </View>
        </AuthProvider>
      </SyncProvider>
    </SQLiteProvider>
  );
}
