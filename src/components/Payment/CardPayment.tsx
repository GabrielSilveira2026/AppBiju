import { constants } from '@/src/constants/constants';
import { useAuthContext } from '@/src/contexts/AuthContext';
import { PaymentType } from '@/src/types/types';
import { colors } from '@/styles/color';
import { globalStyles } from '@/styles/styles';
import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native'

type CardPaymentProps = {
    payment: PaymentType;
  };
  
  export default function CardPayment({ payment }: CardPaymentProps) {
    const { user } = useAuthContext()
    const [modeCard, setModeCard] = useState<"view" | "create">("view");

    if (modeCard === "view") {
        return (
            <Pressable style={[globalStyles.cardContainer, stylesView.cardContainer]}>
                <View style={styles.line}>
                    <View style={stylesView.textContainer}>
                        <Text style={styles.textValue}>{new Date(payment.data_pagamento).toLocaleDateString()}</Text>
                    </View>
                    {
                        // user?.id_perfil === constants.perfil.funcionario.id_perfil &&
                        <View style={stylesView.textNameContainer}>
                            <Text style={styles.textValue}>{payment.nome}</Text>
                        </View>
                    }
                    <View style={stylesView.textContainer}>
                        <Text style={styles.textValue}>R${payment.valor_pagamento.toFixed(2)}</Text>
                    </View>
                </View>
            </Pressable>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 4,
        padding: 8,
        backgroundColor: colors.backgroundTertiary
    },
    line: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        gap: 32,
    },
    textValue: {
        fontSize: 16,
        color: colors.text,
        textAlign: "center"
    },
    valueVertical: {
        padding: 8,
        gap: 8,
        alignItems: "center",
    },
    titleText: {
        fontSize: 16,
        color: colors.text,
        textAlign: "center"
    },
    inputValue: {
        fontSize: 16,
        padding: 8,
        color: colors.text,
    },
    buttonsContainer: {
        flexDirection: "row",
        gap: 8,
    },
    dataContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    dataValue: {
        padding: 12,
        backgroundColor: colors.backgroundInput,
        borderBottomColor: colors.text,
        borderBottomWidth: 1,
        borderRadius: 4,
        alignItems: "center",
    },
    dataText: {
        fontSize: 16,
        color: colors.text,
    },
})

const stylesView = StyleSheet.create({
    cardContainer: {
        borderBottomWidth: 1,
        borderBottomColor: colors.text
    },
    textContainer: {
        paddingVertical: 8,
    },
    textNameContainer: {
        flex: 1
    },
    iconsLine: {
        paddingHorizontal: 8
    }
})