import React, { useEffect, useState } from "react";
import { ImageBackground, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import CardDay, { CardDayData } from "@/src/components/DayDetails/CardDay";
import { IMAGE_PATHS } from "@/styles/constants";
import { globalStyles } from "@/styles/styles";

export default function DayDetails() {
    const params = useLocalSearchParams();

    const [dayData, setDayData]= useState<CardDayData>({
        id_pessoa: Number(params.id_pessoa),
        pessoa: String(params.pessoa),
        data_dia_producao: Array.isArray(params.data_dia_producao)
            ? params.data_dia_producao[0]
            : params.data_dia_producao || undefined,
        valor_dia: params.valor_dia ? Number(params.valor_dia) : undefined,
    })

    useEffect(() => {
        console.log(params);
    }, [params]);

    const handleSubmit = (data: CardDayData) => {
        console.log("Form submitted:", data);
    };
    
    return (
        <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
            <SafeAreaView style={globalStyles.pageContainer}>
                <CardDay
                    mode={params.data_dia_producao ? "edit" : "create"}
                    onSubmit={handleSubmit}
                    dayData={dayData}
                />
            </SafeAreaView>
        </ImageBackground>
    );
}
