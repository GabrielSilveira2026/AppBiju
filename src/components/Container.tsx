import { StyleSheet } from "react-native";
import { View } from "react-native";
import { colors } from "../constants/color";

export default function Container({ children }: { children: React.ReactNode }) {
    return (
        <View style={styles.container}>
            {children}
        </View>
    )
}


export const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.fundo75,
        borderRadius: 8,
        padding: 8,
        gap: 16,
        height: "auto",
        width: "100%"
    }
});