import { colors } from '@/styles/color'
import { Ionicons } from '@expo/vector-icons'
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native'
import { ProductionType, ProductType } from '../../types/types';
import { useEffect, useState } from 'react';
import { globalStyles } from '@/styles/styles';
import { Input } from '../Input';
import { useSync } from '@/src/contexts/SyncContext';
import { useIsFocused } from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown'

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
                    <View style={styles.textContainer}>
                        <View style={{ flex: 1, gap: 8 }}>
                            <Text style={styles.text}>{productionValues.nome_produto}</Text>
                            <Text style={styles.text}>{productionValues.observacao}</Text>
                        </View>
                        <View style={{ justifyContent: "space-between" }}>
                            <Text style={styles.text}>Qtde {productionValues.quantidade}</Text>
                            <Text style={styles.text}>R$ {(productionValues.historico_preco_unidade * productionValues.quantidade).toFixed(2)}</Text>
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
                    setModeCard("details")
                    setProductionValues(production)
                }} name={"arrow-back-outline"} size={35} color={colors.primary} />
                <View style={{ flexDirection: "row", gap: 8 }}>
                    <SelectDropdown
                        data={productList}
                        onSelect={(selectedItem, index) => {
                            console.log(selectedItem, index);
                        }}
                        renderButton={(selectedItem, isOpened) => {
                            return (
                                <View style={stylesEditAndCreate.dropdownButtonStyle}>
                                    <Text style={stylesEditAndCreate.dropdownButtonTxtStyle}>
                                        {(selectedItem && selectedItem.nome) || 'Selecione um produto'}
                                    </Text>
                                    <Ionicons name={isOpened ? 'chevron-up-outline' : 'chevron-down-outline'} color={colors.primary} size={30} />
                                </View>
                            );
                        }}
                        renderItem={(item: ProductType, index, isSelected) => {
                            return (
                                <View style={stylesEditAndCreate.dropdownItemStyle}>
                                    <Text style={styles.text}>{item.nome || "teste"}</Text>
                                </View>
                            );
                        }}
                        dropdownStyle={stylesEditAndCreate.dropdownMenuStyle}
                    />
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
                onPress={() => {setModeCard("details")}}
            >
                <View style={stylesEditAndCreate.headerButtons}>
                    <Ionicons onPress={() => {
                        getProductList()
                        setModeCard("edit")
                    }} name={"create-outline"} size={35} color={colors.primary} />
                    <Ionicons style={{ flex: 1, textAlign: "right" }} onPress={() => setModeCard("view")} name={"chevron-up-outline"} size={35} color={colors.primary} />
                </View>

                <View>

                </View>

            </Pressable>
        )
    }
}

const styles= StyleSheet.create({
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
})

const stylesEditAndCreate = StyleSheet.create({
    headerButtons: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    dropdownButtonStyle: {
        flex: 4,
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        backgroundColor: colors.backgroundInput,
        borderBottomColor: colors.text,
        borderBottomWidth: 1,
        borderRadius: 4,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
    },
    dropdownMenuStyle: {
        marginTop: -35,
        backgroundColor: colors.backgroundTertiary,
        borderBottomStartRadius: 4,
        borderBottomEndRadius: 4,
        borderBottomWidth: 1,
        borderBottomColor: "white",
    },
    dropdownItemStyle:{
        padding: 8
    }
})