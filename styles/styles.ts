import { colors } from "@/styles/color";
import { StyleSheet, Dimensions } from "react-native";
import { StatusBar } from "react-native";

const { height } = Dimensions.get('window');
const statusBarHeight = StatusBar.currentHeight || 0;

export const globalStyles = StyleSheet.create({
    pageContainer: {
        height: height,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        padding: 8,
        paddingBottom: 30,
    },
    container: {
        flexGrow: 0,
        backgroundColor: colors.backgroundSecundary,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 8,
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
        resizeMode: "cover",
    },
    title: {
        fontSize: 20,
        fontWeight: "regular",
        color: colors.text
    },
    bottomDias: {
        flexDirection: "row",
        justifyContent: "flex-end",
        borderTopWidth: 1,
        borderTopColor: colors.primary,
        paddingTop: 8,
    },
});