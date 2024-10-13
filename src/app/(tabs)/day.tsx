import React, { useEffect, useState } from "react";
import { Alert, ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { IMAGE_PATHS } from "@/styles/constants";
import { globalStyles } from "@/styles/styles";
import { DayType } from "@/src/types/types";
import { useIsFocused } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from "@/src/components/Button";
import { colors } from "@/styles/color";
import { Ionicons } from "@expo/vector-icons";
import { useSync } from "@/src/contexts/SyncContext";
import { SafeAreaView } from "react-native-safe-area-context";


export type CardDayData = Partial<Omit<DayType, 'id_pessoa' | 'pessoa'>> & {
    id_pessoa: number;
    pessoa: string;
};

export default function DayDetails() {
    const params = useLocalSearchParams();
    const isFocused = useIsFocused();
    const sync = useSync();

    const [mode, setMode] = useState<"view" | "edit" | "create" | undefined>(undefined);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [showPicker, setShowPicker] = useState<boolean>(false)

    useEffect(() => {
        if (isFocused) {
            const data = Array.isArray(params.data_dia_producao)
                ? params.data_dia_producao[0]
                : params.data_dia_producao || undefined
            if (data) {
                setMode("view")
                setSelectedDate(new Date(data))
            }
            else {
                setMode("create")
                setSelectedDate(new Date())
            }
        }
        return () => {
            setMode(undefined)
            setSelectedDate(undefined)
        }
    }, [isFocused])

    const handleDateChange = (event: any, date: Date | undefined) => {
        setShowPicker(false)
        if (date) {
            setSelectedDate(date);
        }
    };

    async function createDay() {
        const userId = Array.isArray(params.id_pessoa) ? params.id_pessoa[0] : params.id_pessoa;
        
        if (selectedDate) {
            const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
        
            console.log(localDate.toISOString());
    
            const response = await sync.postDay(parseInt(userId), localDate.toISOString());
            router.replace({
                pathname: '../(tabs)/day',
                params: { ...response.response, pessoa: params.pessoa }
            })
            setMode("view")
        }
        else {
            Alert.alert("Data invalida", "Por favor, selecione um dia")
        }
    }

    return (
        <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
            <SafeAreaView style={globalStyles.pageContainer}>
                <View style={globalStyles.container}>
                    <View style={styles.dayContainer}>
                        <View style={styles.firstLine}>
                            <View style={styles.backAndData}>
                                <Ionicons
                                    onPress={() => {
                                        if (mode === "edit") {
                                            setMode("view")
                                        }
                                        else {
                                            router.navigate("/");
                                        }
                                    }}
                                    name="arrow-back-outline"
                                    size={35}
                                    color={colors.primary}
                                />
                                {
                                    mode && mode !== "view" ?
                                        <Pressable
                                            onPress={() => setShowPicker(!showPicker)}
                                        >
                                            <View style={styles.dataContainer}>
                                                <Text style={styles.dataText}>{selectedDate?.toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</Text>
                                            </View>
                                        </Pressable>
                                        :
                                        <Text style={styles.textValue}>{selectedDate?.toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</Text>
                                }
                                {
                                    showPicker
                                    &&
                                    <DateTimePicker
                                        value={selectedDate || new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={handleDateChange}
                                    />
                                }

                            </View>
                            {
                                mode && mode !== "create" &&
                                <Ionicons
                                    onPress={() => setMode("edit")}
                                    name={mode === "view" ? "create-outline" : "trash-outline"}
                                    size={35}
                                    color={mode === "view" ? colors.primary : colors.error}
                                />
                            }
                        </View>
                        <View style={styles.secondLine}>
                            <Text style={styles.textValue}>R${params.valor_dia || '0,00'}</Text>
                            <Text style={styles.textValue}>{params?.pessoa}</Text>
                        </View>
                    </View>
                </View>
                <View style={[globalStyles.container, styles.containerProducts]}>
                    <View style={styles.headerProducts}>
                        <Text style={globalStyles.title}>
                            Produtos
                        </Text>
                    </View>
                    <Button title={"Adicionar"}/>
                </View>
                {
                    mode && mode !== 'view' &&
                    <Button title={"Salvar"} onPress={createDay} />
                }
            </SafeAreaView>
        </ImageBackground>
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
        flexGrow: 1
    },
    headerProducts: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        gap: 8,
    }
});
