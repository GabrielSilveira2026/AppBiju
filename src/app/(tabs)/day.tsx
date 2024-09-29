import React, { useEffect, useState } from "react";
import { ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { IMAGE_PATHS } from "@/styles/constants";
import { globalStyles } from "@/styles/styles";
import { DayType } from "@/src/types/types";
import { useIsFocused } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from "@/src/components/Button";
import { colors } from "@/styles/color";
import { Input } from "@/src/components/Input";
import { Ionicons } from "@expo/vector-icons";


export type CardDayData = Partial<Omit<DayType, 'id_pessoa' | 'pessoa'>> & {
    id_pessoa: number;
    pessoa: string;
};

export default function DayDetails() {
    const params = useLocalSearchParams();
    const isFocused = useIsFocused();

    const [mode, setMode] = useState<"view" | "edit" | "create">();
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
            }
        }
        return () => {
            setSelectedDate(undefined)
        }
    }, [isFocused])

    const handleDateChange = (event: any, date: Date | undefined) => {
        setShowPicker(false)
        if (date) {
            setSelectedDate(date);
        }
    };

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
                                    mode !== "view" ?
                                        <Pressable
                                            style={styles.dataButton}
                                            onPress={() => setShowPicker(!showPicker)}
                                        >
                                            <View style={styles.dataContainer}>
                                                <Text style={styles.dataText}>{selectedDate ? selectedDate.toLocaleDateString() : "__/__/__"}</Text>
                                            </View>
                                        </Pressable>
                                        :
                                        <Text style={styles.textValue}>{selectedDate?.toLocaleDateString()}</Text>
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
                                mode !== "create"
                                &&
                                <Ionicons
                                    onPress={() => setMode("edit")}
                                    name={mode === "view" ? "create-outline" : "trash-outline"}
                                    size={35}
                                    color={mode === "view" ? colors.primary : colors.error}
                                />
                            }
                        </View>
                        <View style={styles.secondLine}>
                            <Text style={styles.textValue}>Total: R${params.valor_dia || '0,00'}</Text>
                            <Text style={styles.textValue}>{params?.pessoa}</Text>
                        </View>
                    </View>

                </View>
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
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    dataButton: {
        flexGrow: 1
    },
    dataContainer: {
        backgroundColor: colors.backgroundInput,
        borderBottomColor: colors.text,
        borderBottomWidth: 1,
        alignItems: 'flex-start',
    },
    dataText: {
        color: "red",
        backgroundColor: "blue",
    },
    secondLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textValue: {
        fontSize: 18,
        color: colors.text,
    }
});
