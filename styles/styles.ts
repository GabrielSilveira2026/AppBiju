import { colors } from "@/styles/color";
import { StyleSheet, Dimensions } from "react-native";
import { StatusBar } from "react-native";

const { height } = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight || 0;

export const globalStyles = StyleSheet.create({
    pageContainer: {
        flex: 1,
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
        height: height + statusBarHeight + 2,
        paddingTop: statusBarHeight,
        resizeMode: "cover",
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