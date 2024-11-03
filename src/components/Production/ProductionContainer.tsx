import { ProductionType } from '@/src/types/types';
import { globalStyles } from '@/styles/styles';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native'
import CardProduction from './CardProduction';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/styles/color';

type ProductionProps = {
    id_dia: string,
    production: ProductionType[]
}

export default function ProductionContainer({ id_dia, production }: ProductionProps) {
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [productionList, setProductionList] = useState<ProductionType[]>(production)

    useEffect(() => {        
        setProductionList(production)
    }, [])

    function handleCreateProduct() {
        if (!isAdding) {
            setIsAdding(true)

            const newProduction: ProductionType = {
                id_producao: "",
                id_dia: id_dia,
                id_produto: "",
                tempo_minuto: 0,
                nome_produto: "",
                quantidade: 0,
                observacao: "",
                historico_preco_unidade: 0,
            };
            setProductionList((prevProductList) => [newProduction, ...prevProductList]);
        }
        else {
            setIsAdding(false)
        }
    }

    return (
        <View style={[globalStyles.container, styles.containerProducts]} >
            <FlatList
                ListHeaderComponent={
                    <View style={styles.headerProducts}>
                        <Text style={globalStyles.title}>Produtos</Text>
                    </View>
                }
                data={productionList}
                renderItem={({ item }) =>
                    <CardProduction
                        production={item}
                        mode={item.id_producao !== "" ? "view" : "create"}
                    />
                }
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ gap: 8 }}
            />
            <View style={globalStyles.bottomAdd}>
                <Ionicons
                    onPress={handleCreateProduct}
                    name="add-circle-outline"
                    color={colors.primary}
                    size={50}
                    disabled={isAdding}
                />
            </View>
        </View >
    )
}
const styles = StyleSheet.create({
    containerProducts: {
        flex: 1,
        flexGrow: 1,
    },
    headerProducts: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        gap: 8,
    }
})