import { globalStyles } from "@/styles/styles";
import { ActivityIndicator, ImageBackground, Text, View } from "react-native";
import { useSync } from "../contexts/SyncContext";
import { useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { colors } from "@/styles/color";

export default function Loading() {
    const sync = useSync()
    const { setIsLoading } = useAuthContext()
    async function syncData() {
        await sync.syncData()
    }

    useEffect(() => {
        syncData()
        setIsLoading(false)
        return () => {
        }
    }, [])

    return (
        <View style={globalStyles.pageContainer}>
            <ActivityIndicator color={colors.primary} size={64} />
        </View>
    )
}