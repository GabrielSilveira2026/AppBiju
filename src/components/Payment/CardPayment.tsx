import { constants } from '@/src/constants/constants';
import { useAuthContext } from '@/src/contexts/AuthContext';
import { PaymentType, PendingPaymentType, UserType } from '@/src/types/types';
import { colors } from '@/styles/color';
import { globalStyles } from '@/styles/styles';
import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import Select from '../Select';
import { useSync } from '@/src/contexts/SyncContext';
import Button from '../Button';
import DatePicker from '../DatePicker';
import { Ionicons } from '@expo/vector-icons';

type CardPaymentProps = {
    payment: PaymentType,
    mode: "view" | "create" | "details",
    onCancel?: () => void;
    onSave: (payment: PaymentType) => void;
    onDelete: (id_payment: string) => void;
};

export default function CardPayment({ onDelete, onSave, onCancel, payment, mode }: CardPaymentProps) {

    const { user } = useAuthContext()
    const sync = useSync()
    const [modeCard, setModeCard] = useState<"view" | "create" | "details">(mode);
    const [pendingPaymentList, setPendingPaymentList] = useState<PendingPaymentType[]>([])
    const [paymentValues, setPaymentValues] = useState<PaymentType>(payment)

    async function getPendingPayment() {
        const request = await sync.getPendingPayment(payment.id_pessoa)
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

    const handleInputChange = (field: keyof PaymentType, value: string | number) => {
        setPaymentValues(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    async function savePayment() {
        if (!paymentValues?.id_pessoa) {
            return;
        }
        onSave(paymentValues)
    }

    async function deletePayment() {
        if (paymentValues.id_pagamento !== "") {
            Alert.alert("Deletar pagamento?", `Deseja deletar esse pagamento?`, [
                {
                    text: "Cancelar"
                },
                {
                    text: "Confirmar",
                    onPress: async () => {
                        onDelete(paymentValues.id_pagamento);
                    }
                }
            ]);
        }
    }

    if (modeCard === "view") {
        return (
            <Pressable onPress={() => {
                if (user?.id_perfil !== constants.perfil.funcionario.id_perfil) {
                    setModeCard("details")
                }
            }}
                style={[globalStyles.cardContainer, stylesView.cardContainer]}
            >
                <View style={{ alignItems: "flex-start" }}>
                    {
                        user?.id_pessoa !== payment.id_pessoa &&
                        <View style={stylesView.textNameContainer}>
                            <Text style={styles.textValue}>{payment.nome}</Text>
                        </View>
                    }
                </View>
                <View style={styles.line}>
                    <View style={stylesView.textContainer}>
                        <Text style={styles.textValue}>{new Date(payment.data_pagamento).toLocaleDateString("pt-BR", { timeZone: "UTC", day: "2-digit", month: "2-digit", year: "2-digit" })}</Text>
                    </View>
                    <View style={stylesView.textContainer}>
                        <Text style={styles.textValue}>R${payment.valor_pagamento.toFixed(2)}</Text>
                    </View>
                    {
                        user?.id_perfil !== constants.perfil.funcionario.id_perfil &&
                        <Ionicons name={"chevron-down-outline"} size={35} color={colors.primary} />
                    }
                </View>
            </Pressable>
        )
    }
    else if (modeCard === "details") {
        return (
            <View style={[globalStyles.cardContainer, stylesdetails.cardContainer]}>
                <View style={styles.line}>
                    <TouchableOpacity onPress={deletePayment}>
                        <Ionicons name="trash-outline" size={35} color={colors.error} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setModeCard("view")} style={{ flex: 1 }}>
                        <Ionicons style={{ textAlign: "right" }} name="chevron-up-outline" size={35} color={colors.primary} />
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: "flex-start" }}>
                    {
                        user?.id_pessoa !== payment.id_pessoa &&
                        <View style={stylesView.textNameContainer}>
                            <Text style={styles.textValue}>{payment.nome}</Text>
                        </View>
                    }
                </View>
                <View style={styles.line}>
                    <View style={stylesView.textContainer}>
                        <Text style={styles.textValue}>{new Date(payment.data_pagamento).toLocaleDateString("pt-BR", { timeZone: "UTC", day: "2-digit", month: "2-digit", year: "2-digit" })}</Text>
                    </View>
                    <View style={stylesView.textContainer}>
                        <Text style={styles.textValue}>R${payment.valor_pagamento.toFixed(2)}</Text>
                    </View>
                </View>
            </View >
        )
    }
    else {
        return (
            <Pressable style={[globalStyles.cardContainer, stylesCreate.cardContainer]}>
                <View style={styles.line}>
                    <Select
                        label="nome"
                        id="id_pessoa"
                        initialText={paymentValues.nome}
                        onSelect={(item) => {
                            handleInputChange("id_pessoa", item.id_pessoa)
                            handleInputChange("nome", item.nome)
                            handleInputChange("valor_pagamento", item.total)
                        }}
                        titleSecondLabel="Valor"
                        secondLabel="total"
                        textButton="Selecione um funcionário"
                        list={pendingPaymentList}
                    />
                    <DatePicker
                        textStyle={styles.dataText}
                        date={new Date(paymentValues.data_pagamento)}
                        onDateChange={(date) => handleInputChange("data_pagamento", date.toISOString())}
                    />
                </View>
                <View style={stylesCreate.line}>
                    <View style={stylesView.textContainer}>
                        <Text style={styles.textValue}>Valor a pagar: R${paymentValues?.valor_pagamento?.toFixed(2)}</Text>
                    </View>
                </View>
                <View style={stylesCreate.line}>
                    <Button style={{ flex: 1 }} title={"Descartar"} onPress={onCancel} />
                    {
                        payment !== paymentValues &&
                        <Button style={{ flex: 1 }} title={"Salvar"} onPress={savePayment} />
                    }
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
})

const stylesView = StyleSheet.create({
    cardContainer: {
        borderBottomWidth: 1,
        borderBottomColor: colors.text,
        gap: 8,
        paddingHorizontal: 12
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

const stylesdetails = StyleSheet.create({
    cardContainer: {
        borderWidth: 1,
        borderColor: colors.text,
        padding: 12,
        gap: 12
    }
})

