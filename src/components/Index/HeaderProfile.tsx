import { constants } from "@/src/constants/constants";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { PendingPaymentType } from "@/src/types/types";
import { colors } from "@/styles/color";
import { globalStyles } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type HeaderProfileProps = {
    userData: PendingPaymentType
}

export default function HeaderProfile({ userData }: HeaderProfileProps) {
    return (
        <View style={globalStyles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.firstLineHeader}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.textValue}>
                            {userData ? userData?.nome : "Carregando"}
                        </Text>
                        <Ionicons name={"create-outline"} size={30} color={colors.primary} />
                    </View>

                    <View style={styles.amountToReceiveContainer}>
                        <Text style={styles.textTitle}>
                            Valor a receber
                        </Text>
                        <Text style={styles.textValue}>
                            R${userData ? userData?.total.toFixed(2) : "00,00"}
                        </Text>
                    </View>
                </View>

                <View>
                    <View style={styles.lastPaymentTextContainer}>
                        <Text style={styles.textTitle}>
                            Último Pagamento
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push({ pathname: "/payment", params: { id_pessoa: userData.id_pessoa, pessoa: userData.nome }, })}
                        >
                            <Ionicons
                                name={"open-outline"} size={30} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.textValue}>
                        {userData ? userData?.ultimo_pagamento : "__/__/____"}
                    </Text>
                </View>
            </View>
        </View >
    )
}
const styles = StyleSheet.create({
    headerContainer: {
        paddingVertical: 16,
        paddingHorizontal: 8,
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
        gap: 8,
    },

    amountToReceiveContainer: {
        flexShrink: 1,
        minWidth: "40%",
        flexBasis: "auto",
        alignItems: "center",
    },

    lastPaymentTextContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },

    textTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.text,
        flexShrink: 1,
    },

    textValue: {
        fontSize: 16,
        color: colors.text,
    }
});
