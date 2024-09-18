import HeaderProfile from "@/src/components/HeaderProfile";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { consultPending } from "@/src/httpservices/pagamento";
import { colors } from "@/styles/color";
import { IMAGE_PATHS } from "@/styles/constants";
import { globalStyles } from "@/styles/styles";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Button, FlatList, ImageBackground, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { user } = useAuthContext()
  const isFocused = useIsFocused();

  const [amountToRecive, setAmountToRecive] = useState<number>(0)
  const [lastPayment, setLastPayment] = useState<string>("")


  useEffect(() => {
    if (isFocused) {
      consultAmoutToRecive();
    }

    return () => {
      if (!isFocused) {
        setAmountToRecive(0);
      }
    };
  }, [isFocused]);

  async function consultAmoutToRecive() {
    // const response = await consultPending(user?.id_perfil)
    const response = await consultPending(41)
    const date: Date = new Date(response?.data?.items[0]?.ultimo_pagamento);

    setLastPayment(date.toLocaleDateString())
    setAmountToRecive(response?.data?.items[0]?.total.toFixed(2))
  }

  return (
    <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
      <SafeAreaView style={globalStyles.pageContainer}>
        <HeaderProfile name={user?.nome || "Error"} amountToRecive={amountToRecive} lastPayment={lastPayment} />
        <View style={globalStyles.container}>
          <View style={styles.headerDias}>
            <Text style={[globalStyles.title]}>15 dias</Text>
            <Text style={[globalStyles.title, styles.showMore]}>ver mais</Text>
          </View>
          {/* <FlatList
            data={ }
            keyExtractor={item => item.id}
            renderItem={
              ({ item }) => (
                <View>
                  <Text>{item.data}</Text>
                </View>
              )
            }
          /> */}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  headerDias: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  showMore: {
    fontSize: 16,
    color: colors.primary
  }
});
