import { PaymentType, PendingPaymentType } from '@/src/types/types';
import { colors } from '@/styles/color'
import { globalStyles } from '@/styles/styles'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

type CardPaymentProps = {
    pendingPayment: PendingPaymentType,
};

export default function CardEmployee({ pendingPayment }: CardPaymentProps) {
    return (
        <View style={[globalStyles.cardContainer, styles.cardContainer]}>
            <View style={{ flex: 1, gap: 16 }}>
                <View style={styles.line}>
                    <View style={styles.textContainer}>
                        <TouchableOpacity onPress={() => router.navigate({ pathname: "/", params: { id_pessoa: pendingPayment.id_pessoa } })} style={{ justifyContent: "center" }}>
                            <Text style={styles.textValue}>{pendingPayment.nome}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textValue}>Valor a Pagar{"\n"}R${pendingPayment.total.toFixed(2)}</Text>
                    </View>
                </View>
                <View style={styles.line}>
                    <View style={styles.textContainer}>
                        <TouchableOpacity
                            style={styles.line}
                            onPress={() => router.push({ pathname: "/payment", params: { pessoa: pendingPayment.nome }, })}
                        >
                            <Text style={styles.textValue}>Último pagamento</Text>
                            <Ionicons
                                name={"open-outline"} size={30} color={colors.primary} />
                        </TouchableOpacity>
                        <Text
                            style={[styles.textValue, { textAlign: "left" }]}>
                            {
                                new Date(pendingPayment.ultimo_pagamento).toLocaleDateString("pt-BR", { timeZone: "UTC", day: "2-digit", month: "2-digit", year: "2-digit" })
                            }
                        </Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity onPress={() => router.navigate({ pathname: "/", params: { id_pessoa: pendingPayment.id_pessoa } })} style={{ justifyContent: "center" }}>
                <Ionicons name={"arrow-forward-outline"} size={35} color={colors.primary} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 4,
        padding: 8,
        backgroundColor: colors.backgroundTertiary
    },
    line: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
    },
    textValue: {
        fontSize: 16,
        color: colors.text,
        textAlign: "center"
    },
    dataText: {
        fontSize: 16,
        color: colors.text,
    },
    cardContainer: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: colors.text,
        gap: 8,
        paddingHorizontal: 12
    },
    textContainer: {
        paddingVertical: 8,
    },
    iconsLine: {
        paddingHorizontal: 8
    }
})