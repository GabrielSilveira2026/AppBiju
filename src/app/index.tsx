import { Redirect, router, Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, Text, View } from "react-native";
import { IMAGE_PATHS } from "../constants/constants";
import { globalStyles } from "@/styles/styles";
import Loading from "../components/Loading";

export default function Index() {
    return (
        <Loading/>
    )
}