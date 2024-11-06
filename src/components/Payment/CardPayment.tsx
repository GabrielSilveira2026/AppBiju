import { constants } from '@/src/constants/constants';
import { useAuthContext } from '@/src/contexts/AuthContext';
import { PaymentType, PendingPaymentType, UserType } from '@/src/types/types';
import { colors } from '@/styles/color';
import { globalStyles } from '@/styles/styles';
import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Select from '../Select';
import { useSync } from '@/src/contexts/SyncContext';
import Button from '../Button';

type CardPaymentProps = {
    payment: PaymentType;
    mode: "view" | "create"
};

export default function CardPayment({ payment, mode }: CardPaymentProps) {
    const { user } = useAuthContext()
    const sync = useSync()
    const [modeCard, setModeCard] = useState<"view" | "create">(mode);
    const [pendingPaymentList, setPendingPaymentList] = useState<UserType[]>([])
    const [paymentValues, setPaymentValues] = useState<PendingPaymentType>()

    async function getPendingPayment() {
        const request = await sync.getPendingPayment()
        console.log("Pendentes:", request.response);

        setPendingPaymentList(request.response)
    }

    useEffect(() => {
        setModeCard(mode)
        if (mode === "create") {
            getPendingPayment()
        }
        return () => {
        }
    }, [])


    if (modeCard === "view") {
        return (
            <Pressable style={[globalStyles.cardContainer, stylesView.cardContainer]}>
                <View style={styles.line}>
                    <View style={stylesView.textContainer}>
                        <Text style={styles.textValue}>{new Date(payment.data_pagamento).toLocaleDateString()}</Text>
                    </View>
                    {
                        user?.id_pessoa !== payment.id_pessoa &&
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
    else {
        return (
            <Pressable style={[globalStyles.cardContainer, stylesCreate.cardContainer]}>
                <View style={styles.line}>
                    <Select
                        label="nome"
                        id="id_pessoa"
                        onSelect={(item) => {
                            setPaymentValues(item);
                        }}
                        textButton="Selecione um funcionário"
                        list={pendingPaymentList}
                    />
                </View>
                <View style={stylesCreate.line}>
                    <View style={stylesView.textContainer}>
                        <Text style={styles.textValue}>Valor a pagar: R${paymentValues?.total.toFixed(2)}</Text>
                    </View>
                </View>
                <View style={stylesCreate.line}>
                    <Button style={{ flex: 1 }} title={"Descartar"} onPress={() => {

                    }} />
                    <Button style={{ flex: 1 }} title={"Salvar"} onPress={() => {

                    }} />
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
        gap: 8,
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

const stylesCreate = StyleSheet.create({
    cardContainer: {
        borderWidth: 1,
        borderColor: colors.primary,
        padding: 12,
        gap: 8
    },
    line: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    }
})