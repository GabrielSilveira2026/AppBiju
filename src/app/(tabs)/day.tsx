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

    const [dayData, setDayData] = useState<CardDayData>()

    useEffect(() => {
        if (isFocused) {
            const paramsJson = {
                id_pessoa: Number(params.id_pessoa),
                pessoa: String(params.pessoa),
                data_dia_producao: Array.isArray(params.data_dia_producao)
                    ? params.data_dia_producao[0]
                    : params.data_dia_producao || undefined,
                valor_dia: params.valor_dia ? Number(params.valor_dia) : undefined,
            };
            setDayData(paramsJson)
            console.log(paramsJson)
        }  
    }, [isFocused])

    return (
        <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
            <SafeAreaView style={globalStyles.pageContainer}>
                {/* <CardDay
                    mode={params.data_dia_producao ? "edit" : "create"}
                    onSubmit={handleSubmit}
                    dayData={dayData}
                /> */}
                <Text>{dayData?.valor_dia}</Text>
            </SafeAreaView>
        </ImageBackground>
    );
}

