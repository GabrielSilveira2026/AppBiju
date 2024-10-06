import { ProductType } from '@/src/types/types'
import { useState } from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import { Input } from '../Input';
import { colors } from '@/styles/color';
import { Ionicons } from '@expo/vector-icons';

type CardProductProps = {
  product?: ProductType;
  mode?: "view" | "details" | "create" | "edit";
  hourValue: number
};

export default function CardProduct({ hourValue, product, mode = "view" }: CardProductProps) {
  const [modeCard, setModeCard] = useState<"view" | "details" | "create" | "edit">(mode);
  const [formValues, setFormValues] = useState<ProductType>(product || {
    id_produto: 0,
    cod_referencia: 0,
    nome: '',
    descricao: '',
    preco: 0,
    tempo_minuto: 0,
    data_modificado: '',
    modificado_por: '',
    ultimo_valor: 0
  });

  const handleInputChange = (field: keyof ProductType, value: string | number) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  console.log(modeCard);


  return (
    <View style={[styles.container,
    {
      borderWidth: modeCard !== "view" ? 1 : 0,
      borderColor: modeCard === "create" || modeCard === "edit" ? colors.primary : "white"
    }
    ]}>
      <View style={styles.firstLine}>
        {
          modeCard === "details"
          &&
          <>
            <Ionicons onPress={() => setModeCard("edit")} name={"create-outline"} size={35} color={colors.primary} />
            <Ionicons onPress={() => setModeCard("view")} name={"chevron-up-outline"} size={35} color={colors.primary} />
          </>
        }
        {
          modeCard === "edit"
          &&
          <>
            <Ionicons onPress={() => setModeCard("details")} name={"arrow-back-outline"} size={35} color={colors.primary} />
            <Ionicons onPress={() => {
              console.log("Excluindo");
            }} name={"trash-outline"} size={35} color={colors.error} />
          </>
        }
      </View>

      {modeCard === "create" || modeCard === "edit" ? (
        <>
          <Input
            placeholder="Nome do Produto"
            value={formValues.nome}
            onChangeText={value => handleInputChange('nome', value)}
          />
          <Input
            placeholder="Código de Referência"
            value={formValues.cod_referencia.toString()}
            onChangeText={value => handleInputChange('cod_referencia', value)}
          />
          <Input
            placeholder="Preço"
            value={formValues.preco.toString()}
            onChangeText={value => handleInputChange('preco', Number(value))}
          />
          <Button title="Salvar" onPress={() => { setModeCard("view"); console.log('Salvando produto...') }} />
        </>
      ) : (
        <>
          <Text style={styles.textValue}>nome: {formValues.nome}</Text>
          <Text style={styles.textValue}>cod_referencia: {formValues.cod_referencia}</Text>
        </>
      )}
      <Text style={styles.textValue}>Valor unidade: {
        ((hourValue / 60) * formValues.tempo_minuto + formValues.preco).toFixed(2)
      }
      </Text>

      {modeCard === "details" && (
        <View>
          <Text style={styles.textValue}>descricao: {formValues.descricao}</Text>
          <Text style={styles.textValue}>Valor mão de obra: R${formValues.preco}</Text>
          <Text style={styles.textValue}>tempo_minuto: 00:{String(formValues.tempo_minuto).padStart(2, '0')}</Text>
        </View>
      )}
      {modeCard === "view" && (
        <Button title="Detalhes" onPress={() => setModeCard("details")} />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    padding: 8,
    backgroundColor: colors.backgroundTertiary
  },
  firstLine: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  textValue: {
    fontSize: 16,
    color: colors.text
  }
})
