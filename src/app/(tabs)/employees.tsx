import { useSync } from "@/src/contexts/SyncContext";
import { PaymentType } from "@/src/types/types";
import { IMAGE_PATHS } from "@/styles/constants";
import { globalStyles } from "@/styles/styles";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, ImageBackground, Text, View } from "react-native";

export default function Funcionarios() {

    // const pendingPaymentDatabase = usePendingPayment();
    const sync = useSync()

    const [listPendingPayment, setListPendingPayment] = useState<PaymentType[]>([])

    async function getTablePendingPayment() {
        const response = await sync.getPendingPayment()
        setListPendingPayment(response.response)
    }

    useEffect(() => {
        getTablePendingPayment()
    }, [])

    return (
        <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
            <View style={{ flexGrow: 0, justifyContent: 'center', alignItems: 'center' }}>
                <FlatList
                style={{backgroundColor: "white"}}
                    data={listPendingPayment}
                    keyExtractor={item => item.id_pessoa}
                    renderItem={
                        ({ item }) => (
                            <View style={{ marginTop: 30}}>
                                <Text>id_pagamento {item.id_pagamento}</Text>
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
