import { ProductType } from '@/src/types/types'
import { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Input } from '../Input';
import { colors } from '@/styles/color';
import { Ionicons } from '@expo/vector-icons';
import Button from '../Button';

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

  function formatTime(tempoMinuto: number): string {
    const minutes = Math.floor(tempoMinuto / 60);
    const seconds = tempoMinuto % 60;

    // Formata os minutos e segundos com dois dígitos
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }


  function handleTimeInputChange(value: string): void {
    const cleanValue = value.replace(/\D/g, '');

    const numValue = cleanValue.slice(-4);

    let minutes = 0;
    let seconds = 0;

    if (numValue.length <= 2) {
      seconds = parseInt(numValue, 10) || 0;
    } else {
      minutes = parseInt(numValue.slice(0, numValue.length - 2), 10) || 0;
      seconds = parseInt(numValue.slice(-2), 10) || 0;
    }

    const tempoMinuto = minutes * 60 + seconds;

    handleInputChange('tempo_minuto', tempoMinuto);
  }


  return (
    <View style={[styles.container,
    {
      borderWidth: modeCard !== "view" ? 1 : 0,
      borderColor: modeCard === "create" || modeCard === "edit" ? colors.primary : "white"
    }
    ]}>
      <View style={[styles.line, { paddingHorizontal: 8 }]}>
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

      {
        (modeCard === "create" || modeCard === "edit") ?
          (
            <View style={styles.cardOpenedDetails}>
              <View style={styles.line}>
                <Input
                  placeholder="Digite o nome do produto"
                  value={formValues.nome}
                  onChangeText={value => handleInputChange('nome', value)}
                  style={[styles.inputValue, { textAlign: "left" }]}
                />
                <Input
                  placeholder="Código"
                  value={formValues.cod_referencia.toString()}
                  onChangeText={value => handleInputChange('cod_referencia', value)}
                  keyboardType="numeric"
                  style={styles.inputValue}
                />
              </View>
              <Input
                placeholder="Digite uma descrição pro produto, como quantidade de materiais, medidas, etc (Opcional)"
                value={formValues.descricao}
                style={[styles.inputValue, styles.textDescription]}
                onChangeText={value => handleInputChange('descricao', Number(value))}
              />
              <View style={styles.line}>
                <View style={styles.valueVertical}>
                  <Text style={styles.titleText}>Valor mão{"\n"}de obra:</Text>
                  <Input
                    placeholder="Preço"
                    value={formValues.preco.toString()}
                    onChangeText={value => handleInputChange('preco', Number(value))}
                    keyboardType="numeric"
                    style={styles.inputValue}
                  />
                </View>

                <View style={styles.valueVertical}>
                  <Text style={styles.titleText}>Tempo{"\n"}produção:</Text>
                  <Input
                    placeholder="Tempo"
                    value={formatTime(formValues.tempo_minuto)}
                    onChangeText={handleTimeInputChange}
                    keyboardType="numeric"
                    style={styles.inputValue}
                  />
                </View>

                <View style={styles.valueVertical}>
                  <Text
                    style={styles.titleText}
                  >
                    Valor{"\n"}total:
                  </Text>
                  <Text
                    style={styles.textValue}>R$
                    {
                      ((hourValue / 60) * formValues.tempo_minuto + formValues.preco).toFixed(2)
                    }
                  </Text>
                </View>
              </View>

              <Button title="Salvar" onPress={() => { setModeCard("view"); console.log('Salvando produto...') }} />
            </View>
          )
          :
          modeCard === "view" ?
            (

              <View style={styles.line}>
                <View style={styles.nameAndCode}>
                  <View style={styles.textContainer}>
                    <Text style={styles.textValue}>{formValues.nome}</Text>
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.textValue}>Cod. {formValues.cod_referencia}</Text>
                  </View>
                </View>
                <View style={styles.valueVertical}>
                  <Text
                    style={styles.textValue}
                  >
                    Valor{"\n"}total:
                  </Text>
                  <Text
                    style={styles.textValue}>R$
                    {
                      ((hourValue / 60) * formValues.tempo_minuto + formValues.preco).toFixed(2)
                    }
                  </Text>
                </View>
                <View style={styles.buttonOpen}>
                  <Ionicons onPress={() => setModeCard("details")} name={"chevron-down-outline"} size={35} color={colors.primary} />
                </View>
              </View>
            )
            :
            (
              <View style={styles.cardOpenedDetails}>
                <View style={styles.line}>
                  <Text style={styles.textValue}>{formValues.nome}</Text>
                  <Text style={styles.textValue}>Cod.{`\n`}{formValues.cod_referencia}</Text>
                </View>
                <View style={styles.line}>
                  <View style={styles.textDescription}>
                    <Text style={styles.textValue}>{formValues.descricao}</Text>
                  </View>
                </View>
                <View style={styles.line}>

                  <View style={styles.valueVertical}>
                    <Text style={styles.titleText}>Valor mão{"\n"}de obra:</Text>
                    <Text style={styles.textValue}>R${(formValues.preco.toFixed(2))}</Text>
                  </View>

                  <View style={styles.valueVertical}>
                    <Text style={styles.titleText}>Tempo{"\n"}produção:</Text>
                    <Text style={styles.textValue}>00:{String(formValues.tempo_minuto).padStart(2, '0')}</Text>
                  </View>

                  <View style={styles.valueVertical}>
                    <Text
                      style={styles.titleText}
                    >
                      Valor{"\n"}total:
                    </Text>
                    <Text
                      style={styles.textValue}>R$
                      {
                        ((hourValue / 60) * formValues.tempo_minuto + formValues.preco).toFixed(2)
                      }
                    </Text>
                  </View>
                </View>
              </View>
            )
      }

    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    padding: 8,
    backgroundColor: colors.backgroundTertiary
  },
  line: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8
  },
  textContainer: {
    padding: 8
  },
  textValue: {
    fontSize: 16,
    color: colors.text,
  },
  nameAndCode: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-between"
  },
  valueVertical: {
    padding: 8,
    gap: 8,
    alignItems: "center",
  },
  buttonOpen: {
    padding: 8
  },
  cardOpenedDetails: {
    padding: 8,
    gap: 8
  },
  textDescription: {
    flex: 1,
    flexGrow: 1,
    minHeight: 100,
    borderBottomColor: "white",
    borderBottomWidth: 1
  },
  titleText: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center"
  },
  inputValue: {
    fontSize: 16,
    padding: 8,
    color: colors.text,
    textAlign: "center"
  }
})
