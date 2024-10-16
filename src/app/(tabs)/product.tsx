import CardProduct from "@/src/components/Products/CardProduct";
import HourContainer from "@/src/components/Products/HourContainer";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { useSync } from "@/src/contexts/SyncContext";
import { ProductType } from "@/src/types/types";
import { colors } from "@/styles/color";
import { IMAGE_PATHS } from "@/styles/constants";
import { globalStyles } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, ImageBackground, Keyboard, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Product() {
  const sync = useSync();
  const { user } = useAuthContext()
  const isFocused = useIsFocused();
  const [productList, setProductList] = useState<ProductType[]>([]);
  const [hourValue, setHourValue] = useState<string>("0");
  const [isCreating, setIsCreating] = useState<boolean>(false)
  const controller = new AbortController();

  useEffect(() => {
    async function getProductList() {
      const request = await sync.getProduct();
      setProductList(request.response);
    }

    async function getHourValue() {
      const request = await sync.getHourValue();
      setHourValue(request.response[0].valor.toString());
    }

    if (isFocused) {
      getProductList();
      getHourValue();
      setIsCreating(false)
    }

    return () => {
      if (!isFocused) {
        setIsCreating(false)
      }
      controller.abort();
    };
  }, [isFocused]);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);


  async function updateHourValue(newHourValue: string, initialDate: string) {
    const request = await sync.updateHourValue(Number(newHourValue), initialDate);
    if (request.response.status === 200) {
      setHourValue(newHourValue);
    }
  }

  function handleCreateProduct() {
    if (!isCreating) {
      setIsCreating(true)
      const newProduct: ProductType = {
        id_produto_local: 0,
        id_produto: 0,
        cod_referencia: "",
        nome: '',
        descricao: '',
        preco: 0,
        tempo_minuto: 0,
        data_modificado: null,
        modificado_por: user?.id_pessoa || null,
        ultimo_valor: null
      };
      setProductList((prevProductList) => [newProduct, ...prevProductList]);
    }
    else {
      setIsCreating(false)
    }
  }

  async function handleSaveProduct(product: ProductType, initialDate: Date) {
    setIsCreating(true)

    if (product.id_produto === 0) {
      const request = await sync.postProduct(product)

      setProductList((prevProductList) => [request.response[0], ...prevProductList]);

      setProductList((prevProductList) => prevProductList.filter(p => p?.id_produto !== 0));
    }
    else {
      await sync.uptdateProduct(initialDate.toLocaleDateString(), product)
    }

    setIsCreating(false)
  }

  function handleRemoveProduct(productId: number) {
    setIsCreating(false)
    setProductList((prevProductList) => prevProductList.filter((product) => product.id_produto !== productId));
  }

  return (
    <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
      <SafeAreaView style={globalStyles.pageContainer}>
        <View style={[globalStyles.container, styles.productContainer]}>


          <FlatList
            data={productList}
            style={{ marginBottom: productList.length < 3 && isKeyboardVisible ? 280 : 0 }}
            contentContainerStyle={{ gap: 8 }}
            keyExtractor={(item) => String(item.id_produto)}
            ListHeaderComponent={<>
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
            </>
            }
            renderItem={({ item }) =>
              <CardProduct
                mode={item.id_produto !== 0 ? "view" : "create"}
                product={item}
                hourValue={Number(hourValue)}
                onSave={handleSaveProduct}
                onCancel={() => handleRemoveProduct(item.id_produto_local)}
              />
            }
          />
          <View style={globalStyles.bottomDias}>
            <Ionicons
              onPress={handleCreateProduct}
              name="add-circle-outline"
              color={colors.primary}
              size={50}
              disabled={isCreating}
            />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  productContainer: {
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
