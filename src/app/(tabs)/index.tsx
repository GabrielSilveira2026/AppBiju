import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ImageBackground, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { Redirect, router, useLocalSearchParams } from "expo-router";

import DayListItem from "@/src/components/Index/DayListItem";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { useSync } from "@/src/contexts/SyncContext";
import { DayType, PendingPaymentType, UserType } from "@/src/types/types";
import { colors } from "@/styles/color";
import { IMAGE_PATHS } from "@/styles/constants";
import { globalStyles } from "@/styles/styles";
import { Input } from "@/src/components/Input";
import HeaderProfile from "@/src/components/Index/HeaderProfile";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import AddContainer from "@/src/components/AddContainer";
import { constants } from "@/src/constants/constants";

export default function Profile() {
  const { user } = useAuthContext();
  const sync = useSync();

  const { id_pessoa } = useLocalSearchParams();
  const [userData, setUserData] = useState<PendingPaymentType | undefined>(undefined);
  const [dayList, setDayList] = useState<DayType[] | undefined>([]);
  const [searchDay, setSearchDay] = useState<string>("");
  const [isSearch, setIsSearch] = useState<boolean>(false)
  const [isAdding, setIsAdding] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const isFocused = useIsFocused();
  const controller = new AbortController();

  const id_pessoa_params = Array.isArray(id_pessoa) ? id_pessoa[0] : id_pessoa;

  async function getDataHeader() {    
    const response = await sync.getPendingPayment(parseInt(id_pessoa_params) || user?.id_pessoa);
    let { id_pessoa, nome, total, ultimo_pagamento } = response.response[0];

    ultimo_pagamento = new Date(ultimo_pagamento).toLocaleDateString("pt-BR", { timeZone: "UTC", });

    setUserData({ id_pessoa, nome, total, ultimo_pagamento });
  }

  async function getDataDays() {
    setIsLoading(true)
    await sync.getPeople(user?.id_pessoa || Number(id_pessoa_params));

    const response = await sync.getDay(parseInt(id_pessoa_params) || user?.id_pessoa);

    for (const day of response.response) {
      await sync.getProduction(day.id_dia);
    }
    setDayList(response.response);

    setIsLoading(false)
  }

  useEffect(() => {
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
  }, [])

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

  if (user?.perfil === "Administrador" && !id_pessoa_params) {
    return <Redirect href={"/employees"} />
  }

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
              {dayList?.length ? `${dayList?.length} ${dayList?.length > 1 ? "dias" : "dia"}` : ""}
            </Text>
            {
              isSearch &&
              <Input
                value={searchDay}
                onChangeText={setSearchDay}
                placeholder="Pesquisar"
                inputStyle={{ flex: 1 }}
              />
            }
            {/* {
              isSearch || dayList?.length !== 0 &&
              <Pressable
                onPress={() => {
                  setIsSearch(!isSearch)
                }}
              >
                <Text style={[globalStyles.title, styles.showMore]}>ver mais</Text>
              </Pressable>
            } */}
            <ActivityIndicator animating={isLoading} style={{ marginLeft: "auto" }} color={colors.primary} />
          </View>
          <FlatList
            refreshing={false}
            onRefresh={() => {
              getDataDays()
            }}
            data={isSearch ? dayList : dayList?.slice(0, 15)}
            ListEmptyComponent={
              !dayList?.length && !isLoading ?
                <Text style={[globalStyles.title, { margin: "auto" }]}>Nenhum dia produzido ainda</Text> : <></>
            }
            contentContainerStyle={{ gap: 12 }}
            keyExtractor={(day) => day?.id_dia}
            renderItem={({ item }) => <DayListItem day={item} />}
          />
          {
            user?.id_perfil !== constants.perfil.administrador.id_perfil &&
            <AddContainer
              text="Adicionar dia"
              disable={isAdding}
              onPress={() => {
                setIsAdding(true)
                router.navigate({
                  pathname: '../(tabs)/day',
                  params: {
                    id_pessoa: user?.id_pessoa,
                    pessoa: user?.nome,
                  },
                });
                setIsAdding(false)
              }}
            />
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

});
