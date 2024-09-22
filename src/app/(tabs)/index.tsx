import HeaderProfile from "@/src/components/HeaderProfile";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { useSync } from "@/src/contexts/SyncContext";
import { colors } from "@/styles/color";
import { IMAGE_PATHS } from "@/styles/constants";
import { globalStyles } from "@/styles/styles";
import { useIsFocused } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, ImageBackground, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type UserType = {
  nome: string,
  total: number,
  ultimo_pagamento: string,
}

export default function Profile() {
  const { user } = useAuthContext()
  const sync = useSync()

  const { id_pessoa } = useLocalSearchParams<string>();
  const [userData, setUserData] = useState<UserType | undefined>(undefined)

  const isFocused = useIsFocused();

  useEffect(() => {
    getDataHeader();

  }, [isFocused]);

  async function getDataHeader() {
    const userId = Array.isArray(id_pessoa) ? id_pessoa[0] : id_pessoa;

    const response = await sync.getPendingPayment(parseInt(userId) || user?.id_pessoa);
    let { nome, total, ultimo_pagamento } = response.response[0]

    ultimo_pagamento = new Date(ultimo_pagamento).toLocaleDateString();

    setUserData({ nome, total, ultimo_pagamento })
  }

  return (
    <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
      <SafeAreaView style={globalStyles.pageContainer}>
        {userData && <HeaderProfile userData={userData} />}
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
    paddingHorizontal: 8,
    gap: 8
  },
  showMore: {
    fontSize: 16,
    color: colors.primary
  }
});
