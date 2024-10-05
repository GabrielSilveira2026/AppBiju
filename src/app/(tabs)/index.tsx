import { useEffect, useState } from "react";
import { FlatList, ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";

import DayListItem from "@/src/components/Index/DayListItem";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { useSync } from "@/src/contexts/SyncContext";
import { DayType } from "@/src/types/types";
import { colors } from "@/styles/color";
import { IMAGE_PATHS } from "@/styles/constants";
import { globalStyles } from "@/styles/styles";
import { Input } from "@/src/components/Input";
import HeaderProfile from "@/src/components/Index/HeaderProfile";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

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

  const headerPosition = useSharedValue(-300)
  const daysPosition = useSharedValue(400)

  useEffect(() => {
    headerPosition.value = -300
    headerPosition.value = withTiming(0, {
      duration: 1000,
    })
    daysPosition.value = 400
    daysPosition.value = withTiming(0, {
      duration: 1000,
    })
  }, [isFocused])

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: headerPosition.value
        }
      ]
    }
  })

  const daysStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: daysPosition.value
        }
      ]
    }
  })

  return (
    <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
      <SafeAreaView style={globalStyles.pageContainer}>
        {
          !isSearch
          &&
          userData
          &&
          <Animated.View style={[headerStyle, { width: "100%" }]}><HeaderProfile userData={userData} /></Animated.View>
        }
        <Animated.View style={[daysStyle, globalStyles.container, styles.containerDias]}>
          <View style={styles.headerDias}>
            {
              isSearch &&
              <Ionicons
                onPress={() => {
                  setIsSearch(!isSearch)
                }}
                name="arrow-back-outline"
                size={40}
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
            data={isSearch ? dayList : dayList?.slice(0, 15)}
            contentContainerStyle={{ gap: 12 }}
            keyExtractor={(day) => day.id_dia.toString()}
            renderItem={({ item }) => <DayListItem day={item} />}
          />
          {
            !userId &&
            <View style={styles.bottomDias}>
              <Ionicons
                onPress={() => {
                  router.navigate({
                    pathname: '../(tabs)/day',
                    params: {
                      id_pessoa: user?.id_pessoa,
                      pessoa: user?.nome
                    },
                  });
                }}
                name="add-circle-outline"
                color={colors.primary}
                size={50} />
            </View>
          }
        </Animated.View>
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
