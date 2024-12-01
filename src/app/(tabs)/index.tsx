import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { Redirect, router, useLocalSearchParams } from "expo-router";

import DayListItem from "@/src/components/Index/DayListItem";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { useSync } from "@/src/contexts/SyncContext";
import { DayType, PendingPaymentType, ProductType, UserType } from "@/src/types/types";
import { colors } from "@/styles/color";
import { IMAGE_PATHS } from "@/styles/constants";
import { globalStyles } from "@/styles/styles";
import { Input } from "@/src/components/Input";
import HeaderProfile from "@/src/components/Index/HeaderProfile";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import AddContainer from "@/src/components/AddContainer";

export default function Profile() {
  const { user } = useAuthContext();
  const sync = useSync();
  const { id_pessoa } = useLocalSearchParams();

  const [userData, setUserData] = useState<PendingPaymentType | undefined>(undefined);
  const [dayList, setDayList] = useState<DayType[]>([]);
  const [searchDay, setSearchDay] = useState<string>("");
  const [viewMore, setviewMore] = useState<boolean>(false)
  const [isAdding, setIsAdding] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(false)

  const isFocused = useIsFocused();

  const id_pessoa_params = Number(id_pessoa);

  async function getDataHeader(id_pessoa: number) {
    const response = await sync.getPendingPayment(id_pessoa);

    if (response.origemDados === "Local") {
      sync.setMessage("Os dados foram resgatados localmente, eles podem estar desatualizados, por favor, verifique sua conexão")
    }
    if (response.response[0]) {

      let { id_pessoa, nome, total, ultimo_pagamento } = response.response[0];

      ultimo_pagamento = new Date(ultimo_pagamento).toLocaleDateString("pt-BR", { timeZone: "UTC", });

      setUserData({ id_pessoa, nome, total, ultimo_pagamento });
    }
  }

  async function getPeopleData() {
    await sync.getPeople(Number(id_pessoa_params) || user?.id_pessoa);
  }

  async function getDataDays() {
    setIsLoading(true)
    const response = await sync.getDay(page, Number(id_pessoa_params) || user?.id_pessoa);

    if (page === 0) {
      for (const day of response.response.slice(0, 7)) {
        await sync.getProduction(day.id_dia);
      }
    }

    setHasMore(response.hasMore)
    setDayList(page > 0 ? [...dayList, ...response.response] : response.response);
    setIsLoading(false)
  }

  useEffect(() => {
    getDataDays();
  }, [page])

  useEffect(() => {
    if (isFocused) {
      if (id_pessoa_params || !!user?.id_pessoa) {
        getDataDays();
        getPeopleData()
        getDataHeader(Number(id_pessoa_params) || Number(user?.id_pessoa));
      }
    }
    else {
      setPage(0)
    }
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

  const renderItem = useCallback(({ item }: { item: DayType }) => (
    <DayListItem day={item} />
  ), [])

  if (user?.perfil === "Administrador" && !id_pessoa_params) {
    return (
      <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
        <Redirect href={"/employees"} />
      </ImageBackground>
    )
  } else {
    return (
      <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
        <SafeAreaView style={globalStyles.pageContainer}>
          {
            !viewMore
            &&
            userData
            &&
            <Animated.View style={[headerStyle, { width: "100%" }]}>
              <HeaderProfile userData={userData} />
            </Animated.View>
          }
          <Animated.View style={[daysStyle, globalStyles.container, styles.containerDias]}>
            <View style={styles.headerDias}>
              {
                viewMore &&
                <TouchableOpacity onPress={() => {
                  setviewMore(!viewMore)
                  setPage(0)
                }}>
                  <Ionicons
                    name="arrow-back-outline"
                    size={40}
                    color={colors.primary} />
                </TouchableOpacity>
              }
              <Text style={[globalStyles.title]}>
                {dayList?.length ? `${dayList?.length} ${dayList?.length > 1 ? "dias" : "dia"}` : ""}
              </Text>
              {
                viewMore || dayList?.length !== 0 &&
                <TouchableOpacity
                  onPress={() => {
                    setviewMore(!viewMore)
                  }}
                >
                  <Text style={[globalStyles.title, styles.showMore]}>ver mais</Text>
                </TouchableOpacity>
              }
              {
                isLoading &&
                <ActivityIndicator animating={isLoading} style={{ marginLeft: "auto" }} color={colors.primary} />
              }
            </View>
            <FlatList
              refreshing={false}
              onRefresh={() => {
                if (!isLoading) {
                  setPage(0)
                }
              }}
              data={viewMore ? dayList : dayList.slice(0, 30)}
              ListEmptyComponent={
                !dayList?.length
                  &&
                  !isLoading
                  ?
                  <Text style={[globalStyles.title, { margin: "auto" }]}>
                    Nenhum dia produzido ainda</Text> : null
              }
              contentContainerStyle={{ gap: 12 }}
              keyExtractor={(day) => day?.id_dia}
              maxToRenderPerBatch={10}
              onEndReached={() => {
                if (hasMore && !isLoading && viewMore) {
                  const currentPage = page + 1
                  setPage(currentPage)
                }
              }}
              renderItem={renderItem}
            />
            {
              <AddContainer
                text="Adicionar dia"
                disable={isAdding}
                onPress={() => {
                  setIsAdding(true)
                  router.navigate({
                    pathname: '../(tabs)/day',
                    params: {
                      id_pessoa: userData?.id_pessoa,
                      pessoa: userData?.nome,
                    },
                  });
                  setIsAdding(false)
                }}
              />
            }
          </Animated.View>
        </SafeAreaView>
      </ImageBackground>
    )
  }

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
