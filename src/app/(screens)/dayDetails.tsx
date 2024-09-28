import CardDay from "@/src/components/DayDetails/cardDay";
import { globalStyles } from "@/styles/styles";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function dayDetails() {
    return (
        <SafeAreaView style={globalStyles.pageContainer}>
            <CardDay/>
        </SafeAreaView>
    )
}