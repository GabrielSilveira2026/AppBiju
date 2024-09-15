import { colors } from "@/styles/color";
import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
        fontSize: 24,
        fontWeight: "regular"
    },
    error: {
        color: "#e91515"
    },
});