import { useEffect, useState } from "react";
import { FlatList, ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";

import HeaderProfile from "@/src/components/HeaderProfile";
import DayListItem from "@/src/components/Index/DayListItem";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { useSync } from "@/src/contexts/SyncContext";
import { DayType } from "@/src/types/types";
import { colors } from "@/styles/color";
import { IMAGE_PATHS } from "@/styles/constants";
import { globalStyles } from "@/styles/styles";
import { Input } from "@/src/components/Input";

type UserType = {
  nome: string;
  total: number;
  ultimo_pagamento: string;
};

export default function Profile() {
  const { user } = useAuthContext();
  const sync = useSync();

  const { id_pessoa } = useLocalSearchParams();
  const [userData, setUserData] = useState<UserType | undefined>(undefined);
  const [dayList, setDayList] = useState<DayType[] | undefined>([]);
  const [searchDay, setSearchDay] = useState<string>("");
  const [isSearch, setIsSearch] = useState<boolean>(false)

  const isFocused = useIsFocused();
  const controller = new AbortController();

  const userId = Array.isArray(id_pessoa) ? id_pessoa[0] : id_pessoa;

  useEffect(() => {
    async function getDataHeader() {
      const response = await sync.getPendingPayment(parseInt(userId) || user?.id_pessoa);
      let { nome, total, ultimo_pagamento } = response.response[0];

      ultimo_pagamento = new Date(ultimo_pagamento).toLocaleDateString();

      setUserData({ nome, total, ultimo_pagamento });
    }

    async function getDataDays() {
      const response = await sync.getDay(parseInt(userId) || user?.id_pessoa);
      setDayList(response.response);
    }

    if (isFocused) {
      getDataHeader();
      getDataDays();
    }


    return () => {
      controller.abort();
    };
  }, [isFocused]);

  return (
    <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
      <SafeAreaView style={globalStyles.pageContainer}>
        {!isSearch && userData && <HeaderProfile userData={userData} />}
        <View style={[globalStyles.container, styles.containerDias]}>
          <View style={styles.headerDias}>
            {
              isSearch && 
              <Ionicons 
              onPress={() => {
                setIsSearch(!isSearch)
              }} 
              name="arrow-back-outline" 
              size={35} 
              color={colors.primary} />
            }
            <Text style={[globalStyles.title]}>
              {dayList?.length ? `${dayList?.length} ${dayList?.length > 1 ? "dias" : "dia"}` : "Nenhum dia produzido"}
            </Text>
            {
              isSearch ?
                <Input
                  value={searchDay}
                  onChangeText={setSearchDay}
                  placeholder="Pesquisar"
                /> :
                <Pressable
                  onPress={() => {
                    setIsSearch(!isSearch)
                  }}
                >
                  <Text style={[globalStyles.title, styles.showMore]}>ver mais</Text>
                </Pressable>
            }
          </View>
          <FlatList
            data={isSearch? dayList: dayList?.slice(0, 5)}
            contentContainerStyle={{ gap: 12 }}
            keyExtractor={(day) => day.id_dia.toString()}
            renderItem={({ item }) => <DayListItem day={item} />}
          />
          <View style={styles.bottomDias}>
            <Ionicons onPress={() => { router.navigate("../(screens)/dayDetails") }} name="add-circle-outline" color={colors.primary} size={50} />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  containerDias: {
    flex: 1,
    flexGrow: 1
  },
  headerDias: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    gap: 8,
  },
  showMore: {
    fontSize: 16,
    color: colors.primary,
  },
  bottomDias: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderTopColor: colors.primary,
    paddingTop: 8,
  },
});
