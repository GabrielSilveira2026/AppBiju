import { colors } from '@/styles/color'
import { Ionicons } from '@expo/vector-icons'
import { View, Text, StyleSheet, Pressable, FlatList, Alert } from 'react-native'
import { ProductionType, ProductType } from '../../types/types';
import { useEffect, useState } from 'react';
import { globalStyles } from '@/styles/styles';
import { Input } from '../Input';
import { useSync } from '@/src/contexts/SyncContext';
import Button from '../Button';
import Select from '../Select';

type CardProductionProps = {
    production: ProductionType;
    mode: "view" | "details" | "create" | "edit";
    onCancel?: () => void;
    onSave?: (production: ProductionType) => void;
    onRemove: (production: ProductionType) => void;
};

export default function CardProduction({ onSave, onRemove, onCancel, production, mode }: CardProductionProps) {

    const sync = useSync();
    const [modeCard, setModeCard] = useState<"view" | "details" | "create" | "edit">(mode);
    const [alert, setAlert] = useState<string>("")
    const [productionValues, setProductionValues] = useState<ProductionType>(production);
    const [productList, setProductList] = useState<ProductType[]>([]);

    async function getProductList() {
        const request = await sync.getProduct();
        setProductList(request.response);
    }

    useEffect(() => {
        setModeCard(mode)
        if (mode === "create") {
            getProductList()
        }
        setProductionValues(production)
    }, [production])

    function formatMinutesToHours(totalMinutes: number) {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}`;
    };

    const handleInputChange = (field: keyof ProductionType, value: string | number) => {
        setProductionValues(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    function selectProduct(selectedProduct: ProductType) {
        handleInputChange('id_produto', selectedProduct.id_produto)
        handleInputChange('nome_produto', selectedProduct.nome)
        handleInputChange('tempo_minuto', selectedProduct.tempo_minuto)
        handleInputChange('historico_preco_unidade', selectedProduct.valor_unidade || 0)
    }

    async function saveProduction() {
        if (productionValues.id_produto === "") {
            setAlert("Selecione um produto");
            return;
        }

        if (!productionValues.quantidade) {
            setAlert("Selecione uma quantidade");
            return;
        }

        setAlert("");
        if (onSave) {
            setModeCard("view")
            onSave(productionValues)
        }

    }

    async function deleteProduction() {
        Alert.alert("Excluir produto?", "Deseja realmente excluir esse produto desse dia?", [
            {
                text: "Cancelar"
            },
            {
                text: "Confirmar",
                onPress: async () => {
                    onRemove(production);
                }
            }
        ])
    }

    if (modeCard === "view") {
        return (
            <Pressable
                style={globalStyles.cardContainer}
                onPress={() => setModeCard("details")}
            >
                <View style={stylesView.cardContainer}>
                    <View style={styles.textContainer}>
                        <View style={{ flex: 1, gap: 8 }}>
                            <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">{productionValues.nome_produto}</Text>
                            <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">{productionValues.observacao}</Text>
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
    else if (modeCard === "create" || modeCard === "edit") {
        return (
            <View
                style={[globalStyles.cardContainer, stylesCreateAndEdit.cardContainer]}
            >
                {alert && <Text style={{ color: colors.error }}>{alert}</Text>}
                {
                    modeCard === "edit"
                    &&
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        < Ionicons onPress={() => {
                            setModeCard("details")
                            setProductionValues(production)
                        }} name={"arrow-back-outline"} size={35} color={colors.primary} />
                        <Ionicons onPress={deleteProduction}
                            name={"trash-outline"} size={35} color={colors.error} />
                    </View>
                }
                <View style={{ gap: 8 }}>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                        <View style={{ flex: 5 }}>
                            <Select list={productList} label="nome" onSelect={selectProduct} initialText={production.nome_produto} />
                        </View>
                        {
                            productionValues.id_produto !== "111111" &&
                            <>
                                <Input
                                    inputStyle={{ flex: 1, textAlign: "center" }}
                                    lineStyle={{ flex: 1 }}
                                    onChangeText={(text) => handleInputChange('quantidade', text)}
                                    placeholder="Qtde"
                                    keyboardType='numeric'
                                    selectTextOnFocus={true}
                                    value={productionValues.quantidade === 0 ? "" : productionValues.quantidade.toString()}
                                />
                                <View style={{ gap: 8, justifyContent: "center" }}>
                                    < Ionicons
                                        onPress={() => {
                                            handleInputChange('quantidade', Number(productionValues.quantidade) + 1)
                                        }}
                                        name={"add-outline"}
                                        style={styles.buttonIcon}
                                        size={30} color={colors.primary}
                                    />

                                    < Ionicons
                                        onPress={() => {
                                            if (productionValues.quantidade > 0) {
                                                handleInputChange('quantidade', productionValues.quantidade - 1)
                                            }
                                        }}
                                        name={"remove-outline"}
                                        size={30}
                                        style={styles.buttonIcon}
                                        color={colors.primary}
                                    />

                                </View>
                            </>
                        }
                    </View>
                    {
                        productionValues.id_produto === "111111" &&
                        <View>
                            <Text style={{ color: "white" }}>
                                Hora
                            </Text>
                        </View>
                    }
                    <View>
                        <Input
                            inputStyle={{ flex: 1 }}
                            onChangeText={(text) => handleInputChange('observacao', text)}
                            multiline
                            placeholder="Digite uma anotação"
                            value={productionValues.observacao || ""}
                        />
                    </View>
                    <View style={stylesCreateAndEdit.bottomLine}>
                        <Text style={[styles.text, { textAlign: "center" }]}>
                            Valor total R$ {(productionValues.historico_preco_unidade * productionValues.quantidade).toFixed(2)}
                        </Text>
                        <Text style={[styles.text, { textAlign: "center" }]}>
                            ≈ {formatMinutesToHours(productionValues.tempo_minuto * productionValues.quantidade)}h
                        </Text>
                    </View>
                </View>
                <View style={stylesCreateAndEdit.buttonsContainer}>
                    {
                        modeCard === "create" &&
                        <Button
                            style={{ flex: 1 }}
                            title="Cancelar"
                            onPress={async () => {
                                if (onCancel) {
                                    onCancel();
                                }
                            }}
                        />
                    }
                    <Button
                        style={{ flex: 1 }}
                        title="Salvar"
                        onPress={saveProduction} />
                </View>
            </View>
        )
    }
    else {
        return (
            <View
                style={globalStyles.cardContainer}
            >
                <View style={stylesDetails.headerButtons}>
                    <Ionicons style={{ flex: 1 }} onPress={() => {
                        getProductList()
                        setModeCard("edit")
                    }} name={"create-outline"} size={35} color={colors.primary} />

                    <Ionicons style={{ flex: 3, textAlign: "right" }} onPress={() => setModeCard("view")} name={"chevron-up-outline"} size={35} color={colors.primary} />
                </View>

                <View style={stylesDetails.contentContainer}>

                    <View style={{ flex: 2, gap: 8 }}>
                        <View style={stylesDetails.lineProductName}>
                            <View style={{ maxWidth: "80%" }}>
                                <Text style={styles.text}>
                                    {productionValues.nome_produto}
                                </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Ionicons name="open-outline" size={24} color={colors.primary} />
                            </View>
                        </View>
                        <View>
                            <Text style={styles.text}>{productionValues.observacao}</Text>
                        </View>
                    </View>


                    <View style={{ justifyContent: "space-around", flex: 1, gap: 16 }}>
                        <Text style={[styles.text, { textAlign: "center" }]}>Qtde {productionValues.quantidade}</Text>
                        <Text style={[styles.text, { textAlign: "center" }]}>
                            Valor{"\n"}R$ {(productionValues.historico_preco_unidade * productionValues.quantidade).toFixed(2)}
                        </Text>
                        <Text style={[styles.text, { textAlign: "center" }]}>
                            ≈ {formatMinutesToHours(productionValues.tempo_minuto * productionValues.quantidade)}h
                        </Text>
                    </View>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    textContainer: {
        flexDirection: "row",
        flex: 1,
        gap: 8
    },
    text: {
        color: colors.text,
        fontSize: 16
    },
    buttonIcon: {
        textAlignVertical: "center",
        backgroundColor: colors.backgroundInput,
        padding: 4,
        borderRadius: 4
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

const stylesDetails = StyleSheet.create({
    headerButtons: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between"
    },

    contentContainer: {
        flexDirection: "row",
        paddingVertical: 8,
        gap: 8
    },

    lineProductName: {
        flex: 1,
        gap: 8,
        flexDirection: "row",
        alignItems: "center",
    }
})

const stylesCreateAndEdit = StyleSheet.create({
    cardContainer: {
        borderColor: colors.primary,
        borderWidth: 1,
        gap: 8
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

    dropdownItemStyle: {
        padding: 8
    },

    bottomLine: {
        justifyContent: "space-between",
        flex: 1,
        flexDirection: "row",
        paddingVertical: 8
    },

    buttonsContainer: {
        flexDirection: "row",
        gap: 8,
    },
})