import { useAuthContext } from "@/src/contexts/AuthContext";
import { colors } from "@/styles/color";
import { IMAGE_PATHS } from "@/styles/constants";
import { globalStyles } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { Button, ImageBackground, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  return (
    <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
      <SafeAreaView style={globalStyles.pageContainer}>
        <View style={globalStyles.container}>
          <View style={styles.headerContainer}>

            <View style={styles.firstLineHeader}>
              <View style={styles.nameContainer}>
                <Text style={styles.textTitle}>
                  Gabrielaaaaaaaaaaaaaaaaaaaaa
                </Text>
                <Ionicons name={"create-outline"} size={30} color={colors.primary} />
              </View>

              <View style={styles.valueReciveContainer}>
                <Text style={styles.textTitle}>
                  Valor a receber
                </Text>
                <Text style={styles.textValue}>
                  R$1000,00
                </Text>
              </View>
            </View>

            <View style={styles.lastPaymentContainer}>
              <View style={styles.lastPaymentTextContainer}>
                <Text style={styles.textTitle}>
                  Último Pagamento
                </Text>
                <Ionicons name={"open-outline"} size={30} color={colors.primary} />
              </View>
              <Text style={styles.textValue}>
                09/09/24
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
    paddingVertical: 16,
    gap: 32
  },

  firstLineHeader: {
    flexDirection: "row",
    flex: 1
  },

  nameContainer: {
    flexDirection: "row",
    flexShrink: 1,
    flexBasis: "auto",
    alignItems: "center",
    paddingHorizontal: 8,
    gap: 8,
  },

  valueReciveContainer: {
    flexShrink: 1,
    minWidth: "40%",
    flexBasis: "auto",
    alignItems: "center",
    paddingHorizontal: 8,
  },

  lastPaymentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    flexGrow: 1,
    flexShrink: 1,
    paddingHorizontal: 8,
  },

  lastPaymentTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },

  textTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    flexShrink: 1,
  },

  textValue: {
    fontSize: 18,
    color: colors.text,
  }
});
