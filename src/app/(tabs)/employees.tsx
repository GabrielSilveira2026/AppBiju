import CardEmployee from "@/src/components/Employees/CardEmployee";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { useSync } from "@/src/contexts/SyncContext";
import { PendingPaymentType } from "@/src/types/types";
import { colors } from "@/styles/color";
import { IMAGE_PATHS } from "@/styles/constants";
import { globalStyles } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, ImageBackground, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Funcionarios() {

    const sync = useSync()

    const [listPendingPayment, setListPendingPayment] = useState<PendingPaymentType[]>([])

    async function getPendingPayment() {
        const response = await sync.getPendingPayment()
        setListPendingPayment(response.response)
    }

    async function getPeople() {
        await sync.getPeople()
    }

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            getPeople()
            getPendingPayment()
        }
    }, [isFocused])
    return (
        <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
            <SafeAreaView style={globalStyles.pageContainer}>
                <View style={[globalStyles.container, { flex: 1, flexGrow: 1, }]}>
                    <View style={globalStyles.titleContainer}>
                        <Text style={globalStyles.title}>Funcionários</Text>
                    </View>
                    <FlatList
                        data={listPendingPayment}
                        keyExtractor={item => item.id_pessoa.toString()}
                        contentContainerStyle={{ gap: 16 }}
                        renderItem={
                            ({ item }) => (
                                <CardEmployee pendingPayment={item} />
                            )
                        }
                    />
                </View>
                {/* <View style={{ marginTop: 30 }}>
                                <Text>id_pessoa {item.id_pessoa}</Text>
                                <Text>nome {item.nome}</Text>
                                <Text>ultimo_pagamento {item.ultimo_pagamento}</Text>
                                <Text>total {item.total}</Text>
                                <Button onPress={() => router.navigate({ pathname: "/", params: { id_pessoa: item.id_pessoa }, })} title={"Consulta"}></Button>
                                <Button onPress={() => router.navigate({ pathname: "/payment", params: { id_pessoa: item.id_pessoa, pessoa: item.nome}, })} title={"Pagamento"}></Button>
                            </View> */}
            </SafeAreaView >
        </ImageBackground>
    );
}
