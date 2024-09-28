import { colors } from "@/styles/color";
import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get('window');

export const globalStyles = StyleSheet.create({
    pageContainer: {
        height: height,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        padding: 8
    },
    container: {
        backgroundColor: colors.backgroundSecundary,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 8,
        flexGrow: 0,
        width: "100%",
        gap: 16,
    },
    formContainer: {
        backgroundColor: colors.backgroundTertiary,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 8,
        gap: 16,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: "regular",
        color: colors.text
    },
    error: {
        color: "#e91515"
    },
});