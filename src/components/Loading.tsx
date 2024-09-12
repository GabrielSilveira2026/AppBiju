import { Redirect, router, Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, Text, View } from "react-native";
import { IMAGE_PATHS } from "../constants/constants";
import { globalStyles } from "@/styles/styles";

export default function Loading() {
    return (
        <View style={{ flex: 1 }}>
            <StatusBar style="light" />
            <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
                <Text>Cargando....</Text>
            </ImageBackground>
        </View>
    )
}