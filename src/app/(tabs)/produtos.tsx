import CardProduct from "@/src/components/Products/CardProduct";
import HourContainer from "@/src/components/Products/HourContainer";
import { useSync } from "@/src/contexts/SyncContext";
import { ProductType } from "@/src/types/types";
import { colors } from "@/styles/color";
import { IMAGE_PATHS } from "@/styles/constants";
import { globalStyles } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Produtos() {
  const sync = useSync();
  const isFocused = useIsFocused();
  const [productList, setProductList] = useState<ProductType[]>([]);
  const [hourValue, setHourValue] = useState<string>("0");
  const [isCreating, setIsCreating] = useState<boolean>(false)

  useEffect(() => {
    if (isFocused) {
      listProduto();
      getHourValue();
    }

    return () => {
      if (!isFocused) {
        setProductList([]);
        setIsCreating(false)
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
      setHourValue(newHourValue);
    }
  }

  function handleCreateProduct() {
    if (!isCreating) {
      setIsCreating(true)
      const newProduct: ProductType = {
        id_produto: 0,
        cod_referencia: 0,
        nome: '',
        descricao: '',
        preco: 0,
        tempo_minuto: 0,
        data_modificado: '',
        modificado_por: '',
        ultimo_valor: 0
      };
      setProductList((prevProductList) => [newProduct, ...prevProductList]);
    }
    else{
      setIsCreating(false)
    }
  }

  function handleSaveProduct(product: ProductType) {
    console.log('Salvando produto...', product);
  }

  function handleRemoveProduct(productId: number) {
    setIsCreating(false)
    setProductList((prevProductList) => prevProductList.filter((product) => product.id_produto !== productId));
  }

  return (
    <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
      <View style={globalStyles.pageContainer}>
        <View style={[globalStyles.container, styles.productContainer]}>
          <View style={styles.titleContainer}>
            <Ionicons
              onPress={() => {
                router.navigate("/");
              }}
              name="arrow-back-outline"
              size={35}
              color={colors.primary}
            />
            <Text style={globalStyles.title}>Produtos</Text>
          </View>
          <HourContainer
            hourValueProp={hourValue}
            onUpdateHourValue={updateHourValue}
          />
          <FlatList
            data={productList.slice(0, 5)}
            contentContainerStyle={{ gap: 8 }}
            keyExtractor={(item) => String(item.id_produto)}
            renderItem={({ item }) =>
              item.id_produto ? (
                <CardProduct product={item} hourValue={Number(hourValue)} />
              ) : (
                <CardProduct
                  mode="create"
                  hourValue={Number(hourValue)}
                  onSave={handleSaveProduct}
                  onCancel={() => handleRemoveProduct(item.id_produto)}
                />
              )
            }
          />
          <View style={globalStyles.bottomDias}>
            <Ionicons
              onPress={handleCreateProduct}
              name="add-circle-outline"
              color={colors.primary}
              size={50} />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  productContainer: {
    padding: 8,
    flex: 1,
    flexGrow: 1,
    marginTop: 28
  },
  titleContainer: {
    padding: 8,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
});
