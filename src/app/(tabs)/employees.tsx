import { useAuthContext } from "@/src/contexts/AuthContext";
import { useSync } from "@/src/contexts/SyncContext";
import { PaymentType } from "@/src/types/types";
import { IMAGE_PATHS } from "@/styles/constants";
import { globalStyles } from "@/styles/styles";
import { useIsFocused } from "@react-navigation/native";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, ImageBackground, Text, View } from "react-native";

export default function Funcionarios() {

    const sync = useSync()

    const [listPendingPayment, setListPendingPayment] = useState<PaymentType[]>([])

    async function getTablePendingPayment() {
        const response = await sync.getPendingPayment()
        setListPendingPayment(response.response)
    }

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            getTablePendingPayment()
        }
    }, [isFocused])
    return (
        <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
            <View style={{ flexGrow: 0, justifyContent: 'center', alignItems: 'center' }}>
                <FlatList
                    style={{ backgroundColor: "white" }}
                    data={listPendingPayment}
                    keyExtractor={item => item.id_pessoa.toString()}
                    renderItem={
                        ({ item }) => (
                            <View style={{ marginTop: 30 }}>
                                <Text>id_pessoa {item.id_pessoa}</Text>
                                <Text>nome {item.nome}</Text>
                                <Text>ultimo_pagamento {item.ultimo_pagamento}</Text>
                                <Text>total {item.total}</Text>
                                <Button onPress={() => router.navigate({ pathname: "/", params: { id_pessoa: item.id_pessoa }, })} title={"Consulta"}></Button>
                            </View>
                        )
                    }
                />
            </View >
        </ImageBackground>
    );
}
