import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ImageBackground, Keyboard, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { IMAGE_PATHS } from "@/styles/constants";
import { globalStyles } from "@/styles/styles";
import { DayType, ProductionType } from "@/src/types/types";
import { useIsFocused } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from "@/src/components/Button";
import { colors } from "@/styles/color";
import { Ionicons } from "@expo/vector-icons";
import { useSync } from "@/src/contexts/SyncContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList } from 'react-native';
import CardProduction from "@/src/components/Production/CardProduction";
import AddContainer from "@/src/components/AddContainer";
import { useAuthContext } from "@/src/contexts/AuthContext";
import DatePicker from "@/src/components/DatePicker";

export type CardDayData = Partial<Omit<DayType, 'id_pessoa' | 'pessoa'>> & {
    id_pessoa: number;
    pessoa: string;
};

export default function DayDetails() {
    const params = useLocalSearchParams();
    const { user } = useAuthContext()
    const isFocused = useIsFocused();
    const sync = useSync();
    const controller = new AbortController();

    const id_pessoa_params = Array.isArray(params.id_pessoa) ? params.id_pessoa[0] : params.id_pessoa;

    const id_dia_params = Array.isArray(params.id_dia) ? params.id_dia[0] : params.id_dia;
    console.log(id_dia_params);

    const [mode, setMode] = useState<"view" | "edit" | "create" | undefined>(id_dia_params ? "view" : "create");
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [total, setTotal] = useState<number>()

    const [productionList, setProductionList] = useState<ProductionType[]>([])

    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        const calculatedTotal = productionList.reduce((sum, production) => {
            return sum + (production.historico_preco_unidade * production.quantidade);
        }, 0);
        setTotal(calculatedTotal);

    }, [productionList]);

    async function getProductions(id_dia: string) {
        setIsAdding(true)
        setIsLoading(true)
        const request = await sync.getProduction(id_dia)
        setProductionList(request.response)
        setIsLoading(false)
        setIsAdding(false)
    }

    useEffect(() => {

        if (isFocused) {
            const data = Array.isArray(params.data_dia_producao) ? params?.data_dia_producao[0] : params?.data_dia_producao || undefined;
            if (data) {
                setMode("view");
                setSelectedDate(new Date(data));
            } else {
                setMode("create");
                setSelectedDate(new Date());
            }
            if (id_dia_params) {
                getProductions(id_dia_params)
            }
            else {
                setIsLoading(false)
            }
        } else {
            setProductionList([])
        }
        return () => {
            setMode(undefined);
            setIsAdding(false)
            setProductionList([])
            controller.abort();
        };
    }, [isFocused]);

    function goBack() {
        if (mode === "edit") {
            setMode("view");
        } else {
            if (!id_dia_params && productionList.length > 0) {
                Alert.alert("Salvar suas produções?", "Você ainda não salvou esse dias e suas produções, deseja sair sem salva-las?", [
                    {
                        text: "Cancelar"
                    },
                    {
                        text: "Sair sem salvar",
                        onPress: async () => {
                            router.navigate("/",);
                        }
                    }
                ])
            }
            else {
                router.navigate({
                    pathname: '/',
                    params: {
                        id_pessoa: id_pessoa_params,
                    },
                })
            }
        }
    }

    async function saveDay(new_id?: string) {
        setIsLoading(true)
        if (!id_dia_params) {
            const id_dia = new_id ? new_id : sync.nanoid()
            const response = await sync.postDay(parseInt(id_pessoa_params), localDate.toISOString(), id_dia);
            setMode("view")

            for (const production of productionList) {
                production.id_dia = id_dia
                console.log("Inserindo Id", productionList);
            }
            setProductionList(productionList)
            router.replace({
                pathname: '../(tabs)/day',
                params: { id_pessoa: params.id_pessoa, pessoa: params.pessoa, id_dia: id_dia }
            });
        }
        else {
            const day: DayType = {
                id_dia: id_dia_params,
                id_pessoa: Number(params.id_pessoa),
                data_dia_producao: localDate.toISOString()
            }

            await sync.updateDay(day)

            setMode("view")

            router.replace({
                pathname: '../(tabs)/day',
                params: { id_pessoa: params.id_pessoa, pessoa: params.pessoa, id_dia: id_dia_params }
            });
        }
        setMode("view");
        setIsLoading(false)
    }

    async function deleteDay() {
        Alert.alert("Excluir Dia?", `Deseja realmente excluir esse dia e todas as produções dele?`, [
            {
                text: "Cancelar"
            },
            {
                text: "Confirmar",
                onPress: async () => {
                    setIsLoading(true)
                    const day: DayType = {
                        id_dia: id_dia_params,
                        id_pessoa: Number(params.id_pessoa),
                        data_dia_producao: localDate.toISOString()
                    }
                    await sync.deleteDay(day)
                    router.replace("/")
                    setIsLoading(false)
                }
            }
        ])
    }

    function handleCreateProduction() {
        if (!isAdding) {
            setIsAdding(true)

            const newProduction: ProductionType = {
                id_producao: "",
                id_dia: id_dia_params,
                id_produto: "",
                tempo_minuto: 0,
                nome_produto: "",
                quantidade: 0,
                observacao: "",
                historico_preco_unidade: 0,
            };
            setProductionList((prevProductList) => [newProduction, ...prevProductList]);
        }
        else {
            setIsAdding(false)
        }
    }

    async function handleSaveProduction(production: ProductionType) {
        setIsAdding(true)
        if (production.id_producao === "") {
            console.log("Criando producao", production);

            if (!production.id_dia) {
                if (!id_dia_params) {
                    const id = sync.nanoid()
                    await saveDay(id)
                    production.id_dia = id
                    console.log("Salvando dia", id, production);
                }else{
                    production.id_dia = id_dia_params
                }
            }

            production.id_producao = sync.nanoid()
            const request = await sync.postProduction(production)
            setProductionList((prevProductionList) => [request.response[0], ...prevProductionList]);

            setProductionList((prevProductionList) => prevProductionList.filter(production => production.id_producao !== ""));
        }
        else {
            if (production.id_dia) {
                const request = await sync.updateProduction(production)
                setProductionList((prevProductionList) => prevProductionList.filter(item => item.id_producao !== production.id_producao));
                setProductionList((prevProductionList) => [request.response[0], ...prevProductionList]);
            }

            setProductionList((prevProductionList) => prevProductionList.filter(item => item.id_producao !== production.id_producao));

            setProductionList((prevProductionList) => [production, ...prevProductionList]);
        }
        setIsAdding(false)
    }

    async function handleDeleteProduction(productionRemove: ProductionType) {
        await sync.deleteProduction(productionRemove)
        setProductionList((prevProductionList) => prevProductionList.filter(production => production.id_producao !== productionRemove.id_producao));
    }

    function handleCancelProduction(productionId: string) {
        setIsAdding(false)
        setProductionList((prevProductionList) => prevProductionList.filter((production) => production.id_producao !== productionId));
    }

    return (
        <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
            <SafeAreaView style={globalStyles.pageContainer}>
                {
                    !isKeyboardVisible &&
                    <View style={globalStyles.container}>
                        <View style={styles.dayContainer}>
                            <View style={styles.firstLine}>
                                <View style={styles.backAndData}>
                                    <TouchableOpacity onPress={goBack}>
                                        <Ionicons
                                            name="arrow-back-outline"
                                            size={35}
                                            color={colors.primary}
                                        />
                                    </TouchableOpacity>

                                    {
                                        mode && mode !== "view" ? (
                                            <DatePicker textStyle={styles.dataText} date={selectedDate} onDateChange={setSelectedDate} />
                                        ) : (
                                            <Text style={styles.textValue}>{selectedDate?.toLocaleDateString("pt-BR", { timeZone: "UTC", })}</Text>
                                        )
                                    }
                                </View>
                                {
                                    mode && Number(id_pessoa_params) === user?.id_pessoa &&
                                        mode === "edit" ?
                                        (
                                            <TouchableOpacity onPress={deleteDay}>
                                                <Ionicons
                                                    name={"trash-outline"}
                                                    size={35}
                                                    color={colors.error}
                                                />
                                            </TouchableOpacity>
                                        ) :
                                        mode === "view" && Number(id_pessoa_params) === user?.id_pessoa &&
                                        (
                                            <TouchableOpacity onPress={() => setMode("edit")}>
                                                <Ionicons
                                                    name={"create-outline"}
                                                    size={35}
                                                    color={colors.primary}
                                                />
                                            </TouchableOpacity>
                                        )}
                            </View>
                            <View style={styles.secondLine}>
                                <Text style={styles.textValue}>R${total?.toFixed(2) || '0,00'}</Text>
                                <Text style={styles.textValue}>{params?.pessoa}</Text>
                            </View>
                        </View>
                    </View>
                }
                <View style={[globalStyles.container, styles.containerProducts]}>
                    <FlatList
                        refreshing={false}
                        onRefresh={() => {
                            if (id_dia_params) {
                                getProductions(id_dia_params)
                            }
                        }}
                        ListHeaderComponent={
                            <View style={styles.headerProducts}>
                                <Text style={globalStyles.title}>Produções</Text>
                                <ActivityIndicator animating={isLoading} style={{ marginLeft: "auto" }} color={colors.primary} />
                            </View>
                        }
                        keyboardShouldPersistTaps='handled'
                        data={productionList}
                        renderItem={({ item }) =>
                            <CardProduction
                                production={item}
                                mode={item.id_producao !== "" ? "view" : "create"}
                                onCancel={() => handleCancelProduction(item.id_producao)}
                                onSave={handleSaveProduction}
                                onRemove={handleDeleteProduction}
                            />
                        }
                        style={{ marginBottom: isKeyboardVisible ? 260 : 0 }}
                        keyExtractor={(item, index) => String(index)}
                        contentContainerStyle={{ gap: 8 }}
                    />
                    {mode && mode !== "edit" && Number(id_pessoa_params) === user?.id_pessoa
                        &&
                        < AddContainer
                            text="Adicionar produção"
                            disable={isAdding}
                            onPress={handleCreateProduction}
                        />
                    }
                </View>

                {
                    mode && mode !== 'view' && Number(id_pessoa_params) === user?.id_pessoa && !isLoading &&
                    <View style={{ flexDirection: "row", width: "100%", gap: 8 }}>
                        <Button style={{ flex: 1 }} title={"Descartar"} onPress={goBack} />
                        <Button style={{ flex: 1 }} title={isLoading ? "Carregando" : "Salvar"} onPress={saveDay} />
                    </View>
                }
            </SafeAreaView>
        </ImageBackground >
    );
}

const styles = StyleSheet.create({
    dayContainer: {
        padding: 8,
        gap: 32,
    },
    firstLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backAndData: {
        flexGrow: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dataContainer: {
        padding: 12,
        backgroundColor: colors.backgroundInput,
        borderBottomColor: colors.text,
        borderBottomWidth: 1,
        borderRadius: 4,
        alignItems: "center",
    },
    dataText: {
        fontSize: 20,
        color: colors.text,
    },
    secondLine: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between"
    },
    textValue: {
        fontSize: 24,
        color: colors.text,
    },
    containerProducts: {
        flex: 1,
        flexGrow: 1,
    },
    headerProducts: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        gap: 8,
    }
});
