import { colors } from '@/styles/color'
import { Ionicons } from '@expo/vector-icons'
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native'
import { ProductionType, ProductType } from '../../types/types';
import { useEffect, useState } from 'react';
import { globalStyles } from '@/styles/styles';
import { Input } from '../Input';
import { useSync } from '@/src/contexts/SyncContext';
import { useIsFocused } from '@react-navigation/native';

type CardProductionProps = {
    production: ProductionType;
    mode: "view" | "details" | "create" | "edit";
    onCancel?: () => void;
    onSave?: (production: ProductionType) => void;
};

export default function CardProduction({ production, mode, onSave, onCancel }: CardProductionProps) {
    const sync = useSync();
    const isFocused = useIsFocused();
    const controller = new AbortController();
    const [modeCard, setModeCard] = useState<"view" | "details" | "create" | "edit">(mode);
    const [productionValues, setProductionValues] = useState<ProductionType>(production);
    const [isSelectionProduct, setIsSelectionProduct] = useState<boolean>(false)
    const [productList, setProductList] = useState<ProductType[]>([]);

    useEffect(() => {
        setProductionValues(production)
    }, [production])

    async function getProductList() {
        const request = await sync.getProduct();
        setProductList(request.response);
    }

    useEffect(() => {
        return () => {
            controller.abort();
        };
    }, [isFocused]);

    if (modeCard === "view") {
        return (
            <Pressable
                style={globalStyles.cardContainer}
                onPress={() => setModeCard("details")}
            >
                <View style={stylesView.cardContainer}>
                    <View style={stylesView.textContainer}>
                        <View style={{ flex: 1, gap: 8 }}>
                            <Text style={stylesView.text}>{productionValues.nome_produto}</Text>
                            <Text style={stylesView.text}>{productionValues.observacao}</Text>
                        </View>
                        <View style={{ justifyContent: "space-between" }}>
                            <Text style={stylesView.text}>Qtde {productionValues.quantidade}</Text>
                            <Text style={stylesView.text}>R$ {(productionValues.historico_preco_unidade * productionValues.quantidade).toFixed(2)}</Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-down-outline" size={40} color={colors.primary} />
                </View>
            </Pressable>
        )

    }
    else if (modeCard === "edit" || modeCard === "create") {
        return (
            <View
                style={globalStyles.cardContainer}
            >
                <Ionicons onPress={() => {
                    setIsSelectionProduct(false)
                    setModeCard("details")
                    setProductionValues(production)
                }} name={"arrow-back-outline"} size={35} color={colors.primary} />
                <View style={{ flexDirection: "row", gap: 8 }}>
                    <Pressable
                        style={{ flex: 4 }}
                        onPress={() => {
                            setIsSelectionProduct(!isSelectionProduct)
                            getProductList()
                        }}
                    >
                        <Text
                            style={{ color: "white" }}
                        >Teste produto 1</Text>
                    </Pressable>
                    {
                        isSelectionProduct
                        &&
                        <FlatList
                            style={{
                                position: "absolute",
                                // bottom:,
                                flex: 1,
                            }}
                            data={productList}
                            renderItem={({ item }) => <Text style={{ color: "white" }}>{item.nome}</Text>}
                        />
                    }
                    <Input
                        inputStyle={{ flex: 1 }}
                        onChangeText={() => { }}
                        value='Qtde'
                    />
                </View>
            </View>
        )
    }
    else {
        return (
            <Pressable
                style={globalStyles.cardContainer}
                onPress={() => setModeCard("details")}
            >
                <View style={stylesEditAndCreate.headerButtons}>
                    <Ionicons onPress={() => setModeCard("edit")} name={"create-outline"} size={35} color={colors.primary} />
                    <Ionicons style={{ flex: 1, textAlign: "right" }} onPress={() => setModeCard("view")} name={"chevron-up-outline"} size={35} color={colors.primary} />
                </View>

                <View>

                </View>

            </Pressable>
        )
    }
}

const stylesView = StyleSheet.create({
    cardContainer:
    {
        flexDirection: "row",
        backgroundColor: colors.backgroundTertiary,
        borderRadius: 4,
        gap: 8,
        alignItems: "center",
        padding: 8
    },
    textContainer: {
        flexDirection: "row",
        flex: 1,
        gap: 8
    },
    text: {
        color: colors.text,
        fontSize: 16
    }
})

const stylesEditAndCreate = StyleSheet.create({
    headerButtons: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between"
    }
})