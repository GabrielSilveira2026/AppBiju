import { Slot} from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, View } from "react-native";
import { IMAGE_PATHS } from "../../styles/constants";
import { globalStyles } from "@/styles/styles";

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
