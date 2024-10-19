import { colors } from '@/styles/color'
import { Ionicons } from '@expo/vector-icons'
import { View, Text } from 'react-native'
import { ProductionType } from '../types/types';
import { useEffect, useState } from 'react';

type CardProductionProps = {
    production: ProductionType;
    mode: "view" | "details" | "create" | "edit";
    onCancel?: () => void;
    onSave?: (production: ProductionType) => void;
  };

export default function CardProduction({production, mode, onSave, onCancel}: CardProductionProps) {
    const [modeCard, setModeCard] = useState<"view" | "details" | "create" | "edit">(mode);
    const [productionValues, setProductionValues] = useState<ProductionType>(production);

    useEffect(() => {
        setProductionValues(production)
      }, [production])

    return (
        <View style={{ flexDirection: "row", backgroundColor: colors.backgroundTertiary, borderRadius: 4, gap: 8, alignItems: "center", padding: 8 }}>
            <View style={{ flexDirection: "row", flex: 1, gap: 8 }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text }}>{productionValues.nome_produto}</Text>
                    <Text style={{ color: colors.text }}>{productionValues.observacao}</Text>
                </View>
                <View>
                    <Text style={{ color: colors.text }}>Qtde {productionValues.quantidade}</Text>
                    <Text style={{ color: colors.text }}>R$ {(productionValues.historico_preco_unidade * productionValues.quantidade).toFixed(2)}</Text>
                </View>
            </View>
            <Ionicons name="chevron-down-outline" size={40} color={colors.primary} />
        </View>
    )
}