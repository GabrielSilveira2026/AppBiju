import Button from "@/src/components/Button";
import { Input } from "@/src/components/Input";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { useSync } from "@/src/contexts/SyncContext";
import { colors } from "@/styles/color";
import { IMAGE_PATHS } from "@/styles/constants";
import { globalStyles } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Produtos() {
  const { user } = useAuthContext();
  const sync = useSync()
  const isFocused = useIsFocused();
  const [hourValue, setHourValue] = useState<string>("0")
  const [modeHourValue, setModeHourValue] = useState<"view" | "edit">("view")

  useEffect(() => {
    async function getHourValue() {
      const response = await sync.getHourValue()
      setHourValue(response.response[0].valor.toString())
    }

    getHourValue()
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
            <View style={styles.firstLine}>
              {
                modeHourValue &&
                modeHourValue === "edit" &&
                <Ionicons onPress={() => setModeHourValue("view")} name={"arrow-back-outline"} size={30} color={colors.primary} />
              }
              <Text style={styles.hourText}>Valor Hora: R$</Text>
              {
                modeHourValue &&
                  modeHourValue === "view" ?
                  <>
                    <Text style={styles.hourText}>{hourValue}</Text>
                  </>
                  :
                  <View>
                    <Input
                      value={hourValue.toString()}
                      onChangeText={(text) => setHourValue(text)}
                      keyboardType="number-pad"
                      autoCapitalize="none"
                      style={styles.hourValue}
                    />
                  </View>
              }
              {
                user?.id_perfil !== 3 &&
                modeHourValue &&
                modeHourValue === "view" &&
                <Ionicons onPress={() => setModeHourValue("edit")} name={"create-outline"} size={30} color={colors.primary} />
              }
            </View>
            {
              modeHourValue &&
              modeHourValue === "edit" &&
              <Button title={"Salvar"} onPress={() => {

              }} />
            }
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
  titleContainer: {
    padding: 8,
    gap: 8,
    flexDirection: "row",
    alignItems: "center"
  },
  hourContainer: {
    padding: 12,
    borderRadius: 4,
    backgroundColor: colors.backgroundTertiary,
    gap: 12
  },
  firstLine:{
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8
  },
  hourText: {
    fontSize: 16,
    color: colors.text
  },
  hourValue: {
    flexGrow: 0,
    color: colors.text,
    fontSize: 16,
    padding: 8
  }
})