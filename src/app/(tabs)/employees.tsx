import { IMAGE_PATHS } from "@/styles/constants";
import { globalStyles } from "@/styles/styles";
import { router } from "expo-router";
import { Button, ImageBackground, Text, View } from "react-native";

export default function Funcionarios() {

    return (
        <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Funcionarios</Text>
            </View >
        </ImageBackground>
    );
}
