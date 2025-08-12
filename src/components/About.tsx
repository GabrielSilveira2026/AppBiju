import { colors } from '@/styles/color'
import { Ionicons } from '@expo/vector-icons'
import { View, Text, TouchableOpacity, Linking } from 'react-native'
import Constants from "expo-constants";

export default function About() {
    return (
        <View>
            <View style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                gap: 8
            }}>
                <Text style={{ textAlign: "center", color: colors.text }}>Termos de política e privacidade</Text>
                <TouchableOpacity onPress={() => { Linking.openURL("https://gabrielsilveira2026.github.io/AppBiju-Politica/") }}>
                    <Ionicons name="open-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>
            <Text style={{ textAlign: "center", color: colors.text }}>v{Constants.expoConfig?.version}</Text>
        </View>
    )
}