import { globalStyles } from "@/styles/styles";
import { ImageBackground, Text, View } from "react-native";
import { useSync } from "../contexts/SyncContext";
import { useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";

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
            <Text>Loading Component</Text>
        </View>
    )
}