import { useAuthContext } from "@/src/contexts/AuthContext";
import { useSync } from "@/src/contexts/SyncContext";
import { getPeople } from "@/src/httpservices/user";
import { PendingPaymentType } from "@/src/types/types";
import { IMAGE_PATHS } from "@/styles/constants";
import { globalStyles } from "@/styles/styles";
import { useIsFocused } from "@react-navigation/native";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, ImageBackground, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Funcionarios() {

    const sync = useSync()

    const [listPendingPayment, setListPendingPayment] = useState<PendingPaymentType[]>([])

    async function getTablePendingPayment() {
        const response = await sync.getPendingPayment()
        setListPendingPayment(response.response)
    }

    async function getPeople() {
        const request = await sync.getPeople()
        console.log(request.response);
    }

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            getPeople()
            getTablePendingPayment()
        }
    }, [isFocused])
    return (
        <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
            <SafeAreaView style={globalStyles.pageContainer}>
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
                                <Button onPress={() => router.navigate({ pathname: "/payment", params: { id_pessoa: item.id_pessoa, pessoa: item.nome}, })} title={"Pagamento"}></Button>
                            </View>
                        )
                    }
                />
            </SafeAreaView >
        </ImageBackground>
    );
}
