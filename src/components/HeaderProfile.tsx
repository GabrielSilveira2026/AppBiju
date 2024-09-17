import { colors } from "@/styles/color";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type HeaderProfileProps = {
    name: string,
    amountToRecive: string,
    lastPayment: String
}

export default function HeaderProfile({
    name,
    amountToRecive,
    lastPayment
}: HeaderProfileProps) {
    return (
        <View style={styles.headerContainer}>

            <View style={styles.firstLineHeader}>
                <View style={styles.nameContainer}>
                    <Text style={styles.textTitle}>
                        {name}
                    </Text>
                    <Ionicons name={"create-outline"} size={30} color={colors.primary} />
                </View>

                <View style={styles.amountToReceiveContainer}>
                    <Text style={styles.textTitle}>
                        Valor a receber
                    </Text>
                    <Text style={styles.textValue}>
                        R${amountToRecive}
                    </Text>
                </View>
            </View>

            <View style={styles.lastPaymentContainer}>
                <View style={styles.lastPaymentTextContainer}>
                    <Text style={styles.textTitle}>
                        Último Pagamento
                    </Text>
                    <Ionicons name={"open-outline"} size={30} color={colors.primary} />
                </View>
                <Text style={styles.textValue}>
                    {lastPayment}
                </Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    headerContainer: {
        paddingHorizontal: 8,
        paddingVertical: 16,
        gap: 32
    },

    firstLineHeader: {
        flexDirection: "row",
        width: "100%",
    },

    nameContainer: {
        flexDirection: "row",
        flex: 1,
        flexShrink: 1,
        flexBasis: "auto",
        alignItems: "center",
        paddingHorizontal: 8,
        gap: 8,
    },

    amountToReceiveContainer: {
        flexShrink: 1,
        minWidth: "40%",
        flexBasis: "auto",
        alignItems: "center",
        paddingHorizontal: 8,
    },

    lastPaymentContainer: {
        paddingHorizontal: 8,
    },

    lastPaymentTextContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },

    textTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.text,
        flexShrink: 1,
    },

    textValue: {
        fontSize: 18,
        color: colors.text,
    }
});
