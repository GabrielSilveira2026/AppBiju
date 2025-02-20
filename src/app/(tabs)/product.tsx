import AddContainer from "@/src/components/AddContainer";
import { Input } from "@/src/components/Input";
import CardProduct from "@/src/components/Products/CardProduct";
import HourContainer from "@/src/components/Products/HourContainer";
import { constants } from "@/src/constants/constants";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { useSync } from "@/src/contexts/SyncContext";
import { ProductType } from "@/src/types/types";
import { colors } from "@/styles/color";
import { IMAGE_PATHS } from "@/styles/constants";
import { globalStyles } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, ImageBackground, Keyboard, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Product() {
  const sync = useSync();
  const { user } = useAuthContext();
  const isFocused = useIsFocused();
  const [productList, setProductList] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [search, setSearch] = useState<string>("");
  const [hourValue, setHourValue] = useState<string>("0");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { nome_produto, id_dia, data_dia_producao, id_pessoa, pessoa } = useLocalSearchParams();

  async function getProductList() {
    setIsLoading(true)
    const request = await sync.getProduct();
    setProductList(request.response);
    setFilteredProducts(request.response)
    setIsLoading(false)
  }

  async function getHourValue() {
    setIsLoading(true)
    const request = await sync.getHourValue();
    setHourValue(String(request.response[0].valor));
    setIsLoading(false)
  }

  useEffect(() => {
    if (isFocused) {
      setSearch(nome_produto ? String(nome_produto) : "")
      setIsCreating(false)
      getHourValue();
      getProductList();
    } else {
      setIsCreating(false)
      setSearch("")
      sync.setMessage("")
    }
  }, [isFocused]);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredProducts(productList);
    } else {
      setFilteredProducts(
        productList.filter((product) =>
          product.nome.toLowerCase().includes(search.toLowerCase())
          ||
          String(product.cod_referencia)?.toLowerCase().includes(search.toLowerCase())
        )
      )
    }
  }, [search, productList]);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardVisible(true);
      setKeyboardHeight(e.endCoordinates.height);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const containerPosition = useSharedValue(400)
  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: containerPosition.value
        }
      ]
    }
  })

  useEffect(() => {
    containerPosition.value = 400
    containerPosition.value = withTiming(0, {
      duration: 1000,
    })
  }, [])

  async function updateHourValue(newHourValue: string, initialDate: string) {
    const request = await sync.updateHourValue(Number(newHourValue), initialDate);
    if (request.response.status === 200) {
      setHourValue(newHourValue);
    }
  }

  function handleCreateProduct() {
    if (!isCreating) {
      setIsCreating(true)
      setSearch("")
      const newProduct: ProductType = {
        id_produto: "",
        cod_referencia: 0,
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

    if (product.id_produto === "") {
      product.id_produto = sync.nanoid()
      const request = await sync.postProduct(product)

      setProductList((prevProductList) => [request.response[0], ...prevProductList]);

      setProductList((prevProductList) => prevProductList.filter(product => product.id_produto !== ""));
    }
    else {
      await sync.updateProduct(initialDate.toLocaleDateString(), product)
    }

    setIsCreating(false)
  }

  async function handleDeleteProduct(id_product: string) {
    await sync.deleteProduct(id_product)
    setProductList((prevProductList) => prevProductList.filter(product => product.id_produto !== id_product));
  }

  function handleCancelProduct(productId: string) {
    setIsCreating(false)
    setProductList((prevProductList) => prevProductList.filter((product) => product.id_produto !== productId));
  }

  return (
    <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
      <SafeAreaView style={globalStyles.pageContainer}>
        <Animated.View style={[containerStyle, globalStyles.container, styles.productContainer]}>
          <FlatList
            data={filteredProducts}
            refreshing={false}
            onRefresh={() => {
              if (!isLoading) {
                setIsCreating(false)
                getProductList()
                setSearch("")
              }
            }}
            style={{ marginBottom: isKeyboardVisible ? keyboardHeight -80 : 0 }}
            contentContainerStyle={{ gap: 8 }}
            keyExtractor={(item) => String(item.id_produto)}
            keyboardShouldPersistTaps='handled'
            ListHeaderComponent={<>
              <View style={styles.titleContainer}>
                <TouchableOpacity onPress={() => {
                  if (nome_produto) {
                    router.navigate({
                      pathname: '../../(tabs)/day',
                      params: {
                        id_dia: id_dia,
                        data_dia_producao: data_dia_producao,
                        id_pessoa: id_pessoa,
                        pessoa: pessoa,
                      },
                    });
                  } else {
                    router.navigate("/")
                  }
                }}>
                  <Ionicons
                    name="arrow-back-outline"
                    size={35}
                    color={colors.primary}
                  />
                </TouchableOpacity>
                {
                  !search && <Text style={globalStyles.title}>Produtos</Text>
                }
                <Input
                  value={search}
                  placeholder="Nome ou código"
                  onChangeText={setSearch}
                  inputStyle={{ flex: 1 }}
                />
                {
                  search &&
                  <TouchableOpacity
                    onPress={() => setSearch("")}
                  >
                    <Ionicons name="close-circle-outline" color={colors.primary} size={30} />
                  </TouchableOpacity>
                }
                {
                  isLoading &&
                  <ActivityIndicator animating={isLoading} style={{ marginLeft: "auto" }} color={colors.primary} />
                }
              </View>
              <HourContainer
                hourValueProp={hourValue}
                onUpdateHourValue={updateHourValue}
              />
            </>
            }
            renderItem={({ item }) =>
              <CardProduct
                mode={item.id_produto ? "view" : "create"}
                product={item}
                hourValue={Number(hourValue)}
                onSave={handleSaveProduct}
                onCancel={() => handleCancelProduct(item.id_produto)}
                onDelete={() => handleDeleteProduct(item.id_produto)}
              />
            }
          />
          {
            user?.id_perfil !== constants.perfil.funcionario.id_perfil && 
            <AddContainer
              text="Criar produto"
              disable={isCreating}
              onPress={handleCreateProduct}
            />
          }
        </Animated.View>
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
    paddingBottom: 16,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
});
