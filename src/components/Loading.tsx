import { globalStyles } from "@/styles/styles";
import { ImageBackground, Text, View } from "react-native";

export default function Loading() {
    return (
        <View style={globalStyles.containerContent}>
            <Text>Loading Component.....</Text>
        </View>
    )
}