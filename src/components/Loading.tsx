import { Redirect, router, Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, Text, View } from "react-native";
import { IMAGE_PATHS } from "../constants/constants";
import { globalStyles } from "@/styles/styles";

export default function Loading() {
    return (
        <View style={globalStyles.containerContent}>
            <Text>carregando</Text>
        </View>
    )
}