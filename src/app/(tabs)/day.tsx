import React, { useEffect, useState } from "react";
import { ImageBackground, SafeAreaView, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import CardDay, { CardDayData } from "@/src/components/DayDetails/CardDay";
import { IMAGE_PATHS } from "@/styles/constants";
import { globalStyles } from "@/styles/styles";
import { DayType } from "@/src/types/types";
import { useIsFocused } from "@react-navigation/native";

export default function DayDetails() {
    const params = useLocalSearchParams();
    const isFocused = useIsFocused();

    const [dayData, setDayData] = useState<CardDayData>({
        id_pessoa: Number(params.id_pessoa),
        pessoa: String(params.pessoa)
    })

    const handleSubmit = (data: CardDayData) => {
        console.log("Form submitted:", data);
    };

    useEffect(() => {
        if (isFocused) {
            const paramsJson = {
                id_dia: Number(params.id_dia),
                id_pessoa: Number(params.id_pessoa),
                pessoa: String(params.pessoa),
                data_dia_producao: Array.isArray(params.data_dia_producao)
                    ? params.data_dia_producao[0]
                    : params.data_dia_producao || undefined,
                valor_dia: params.valor_dia ? Number(params.valor_dia) : undefined,
            };
            setDayData(paramsJson)
            console.log("Tela day", paramsJson)
        }
    }, [isFocused])

    return (
        <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
            <SafeAreaView style={globalStyles.pageContainer}>
                <CardDay
                    dayData={dayData}
                    onSubmit={handleSubmit}
                />
            </SafeAreaView>
        </ImageBackground>
    );
}

