import { globalStyles } from "@/styles/styles";
import { ImageBackground, Text, View } from "react-native";
import { useAuthContext } from "../contexts/AuthContext";
import Button from "./Button";

export default function Loading() {
    return (
        <View style={globalStyles.containerContent}>
            <Text>Loading Component.....</Text>
        </View>
    )
}