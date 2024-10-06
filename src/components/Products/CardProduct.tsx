import { ProductType } from '@/src/types/types'
import { useState } from 'react'
import { View, Text, Button } from 'react-native'
import { Input } from '../Input';

type CardProductProps = {
  product?: ProductType;  // Product é opcional no modo "create"
  mode?: "view" | "details" | "create" | "edit";  // Modo opcional
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

  // Função para manipular mudança de valores no modo de edição ou criação
  const handleInputChange = (field: keyof ProductType, value: string | number) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <View>
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
          <Text>nome: {formValues.nome}</Text>
          <Text>cod_referencia: {formValues.cod_referencia}</Text>

          <Text>Valor unidade: {
              ((hourValue / 60) * formValues.tempo_minuto + formValues.preco).toFixed(2)
            }
          </Text>
          <Text>tempo_minuto: {formValues.tempo_minuto}</Text>
          <Text>modificado_por: {formValues.modificado_por}</Text>
        </>
      )}

      {modeCard === "view" && (
        <Button title="Detalhes" onPress={() => setModeCard("details")} />
      )}

      {modeCard === "details" && (
        <View>
          <Text>Detalhes do produto...</Text>
          <Button title="Editar" onPress={() => setModeCard("edit")} />
        </View>
      )}
    </View>
  );
}
