import { useAuthContext } from "@/src/contexts/AuthContext";
import { colors } from "@/styles/color";
import { IMAGE_PATHS } from "@/styles/constants";
import { globalStyles } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect } from "react";
import { Button, ImageBackground, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Produtos() {

  const isFocused = useIsFocused();

  useEffect(() => {

  }, [isFocused]);


  return (
    <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
      <SafeAreaView style={globalStyles.pageContainer}>
        <View style={[globalStyles.container, styles.productContainer]}>
          <View style={styles.titleContainer}>
            <Ionicons name={"arrow-back-outline"} size={35} color={colors.primary} />
            <Text style={globalStyles.title}>Produtos</Text>
          </View>
          <View style={styles.hourContainer}>
            <Text style={styles.hourText}>Valor Hora: R$20,00</Text>
            <Ionicons name={"create-outline"} size={30} color={colors.primary} />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  productContainer: {
    padding: 8,
    flex: 1,
    flexGrow: 1
  },
  titleContainer:{
    padding: 8,
    gap:8,
    flexDirection:"row",
    alignItems: "center"
  },
  hourContainer: {
    flexDirection: "row",
    width: "100%",
    borderRadius: 4,
    padding: 12,
    backgroundColor: colors.backgroundTertiary,
    justifyContent: "center",
    alignItems: "center",
    gap: 8
  },
  hourText: {
    fontSize: 16,
    color: colors.text
  }
})