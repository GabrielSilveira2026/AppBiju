import Loading from "@/src/components/Loading";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { Redirect, Slot, Tabs } from "expo-router";
import { StatusBar, Text, View } from "react-native";

export default function AppLayout() {
    const { isLoading, isAuthenticated, user } = useAuthContext();

    if (isLoading) {
        return <Loading/>
    }

    // if (!isAuthenticated) {
    //     return <Redirect href="/" />;
    // }

    return (
        <Slot/>
    );
}
