import CardProduct from "@/src/components/Products/CardProduct";
import HourContainer from "@/src/components/Products/HourContainer";
import { useSync } from "@/src/contexts/SyncContext";
import { ProductType } from "@/src/types/types";
import { colors } from "@/styles/color";
import { IMAGE_PATHS } from "@/styles/constants";
import { globalStyles } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Produtos() {
  const sync = useSync();
  const isFocused = useIsFocused();
  const [productList, setProductList] = useState<ProductType[]>([]);
  const [hourValue, setHourValue] = useState<string>("0");

  useEffect(() => {
    if (isFocused) {
      listProduto();
      getHourValue(); // Obter valor da hora quando a página é focada
    }

    return () => {
      if (!isFocused) {
        setProductList([]);
      }
    };
  }, [isFocused]);

  async function listProduto() {
    const response = await sync.getProduct();
    setProductList(response.response);
  }

  async function getHourValue() {
    const response = await sync.getHourValue();
    setHourValue(response.response[0].valor.toString());
  }

  async function updateHourValue(newHourValue: string, initialDate: string) {
    const response = await sync.updateHourValue(Number(newHourValue), initialDate);
    if (response.response.status === 200) {
      setHourValue(newHourValue); // Atualiza o valor da hora localmente após sucesso
    }
  }

  return (
    <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
      <SafeAreaView style={globalStyles.pageContainer}>
        <View style={[globalStyles.container, styles.productContainer]}>
          <View style={styles.titleContainer}>
            <Ionicons name={"arrow-back-outline"} size={35} color={colors.primary} />
            <Text style={globalStyles.title}>Produtos</Text>
          </View>
          <HourContainer
            hourValueProp={hourValue} // Passa o valor da hora
            onUpdateHourValue={updateHourValue} // Função para atualizar o valor da hora
          />
          <FlatList
            contentContainerStyle={{ gap: 20 }}
            data={productList.slice(0, 1)}
            keyExtractor={(item) => String(item.id_produto)}
            renderItem={({ item }) => <CardProduct product={item} hourValue={Number(hourValue)} />}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  productContainer: {
    padding: 8,
    flex: 1,
    flexGrow: 1,
  },
  titleContainer: {
    padding: 8,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
});
