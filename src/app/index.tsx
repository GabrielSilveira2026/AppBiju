import { globalStyles } from "@/styles/styles";
import { ActivityIndicator, ImageBackground, Text, View } from "react-native";
import { useSync } from "../contexts/SyncContext";
import { useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { colors } from "@/styles/color";
import { Redirect, router } from "expo-router";
import { useIsFocused } from "@react-navigation/native";

export default function Loading() {
    const { isAuthenticated } = useAuthContext()
    const isFocused = useIsFocused();

    async function loading() {
        const checkUserAuthenticated = await isAuthenticated()

        if (!checkUserAuthenticated) {
            setTimeout(() => {
                router.replace("/login")
            }, 1000);
            return
        }

        setTimeout(() => {
            router.replace("/(tabs)")
        }, 1200);
    }

    useEffect(() => {
        if (isFocused) {
            loading()
        }
    }, [isFocused])

    return (
        <View style={globalStyles.pageContainer}>
            <ActivityIndicator color={colors.primary} size={64} />
        </View>
    )
}