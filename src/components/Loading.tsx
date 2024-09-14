import { globalStyles } from "@/styles/styles";
import { ImageBackground, Text, View } from "react-native";
import { useAuthContext } from "../contexts/AuthContext";
import Button from "./Button";

export default function Loading() {
    const authContext = useAuthContext();


    return (
        <View style={globalStyles.containerContent}>
            <Text>Loading Component.....</Text>
            <Button title="Carrega" onPress={() => authContext.setIsLoading(false)} />
        </View>
    )
}