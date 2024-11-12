import CardEmployee from "@/src/components/Employees/CardEmployee";
import { useSync } from "@/src/contexts/SyncContext";
import { PendingPaymentType } from "@/src/types/types";
import { colors } from "@/styles/color";
import { IMAGE_PATHS } from "@/styles/constants";
import { globalStyles } from "@/styles/styles";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ImageBackground, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Funcionarios() {

    const sync = useSync()
    const isFocused = useIsFocused();

    const [listPendingPayment, setListPendingPayment] = useState<PendingPaymentType[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    async function getPendingPayment() {
        setIsLoading(true)
        const response = await sync.getPendingPayment()
        setListPendingPayment(response.response)
        setIsLoading(false)
    }

    async function getPeople() {
        await sync.getPeople()
    }

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
                        <ActivityIndicator animating={isLoading} style={{ marginLeft: "auto" }} color={colors.primary} />
                    </View>
                    <FlatList
                        data={listPendingPayment}
                        keyExtractor={item => String(item.id_pessoa)}
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
