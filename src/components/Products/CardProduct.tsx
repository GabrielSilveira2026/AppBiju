import { ProductType } from '@/src/types/types'
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native'
import { Input } from '../Input';
import { colors } from '@/styles/color';
import { Ionicons } from '@expo/vector-icons';
import Button from '../Button';
import DateTimePicker from '@react-native-community/datetimepicker';

type CardProductProps = {
  product: ProductType;
  mode?: "view" | "details" | "create" | "edit";
  hourValue: number;
  onCancel?: () => void;
  onSave?: (product: ProductType, initialDate: Date) => void;
};

export default function CardProduct({ onSave, onCancel, hourValue, product, mode = "view" }: CardProductProps) {
  const [modeCard, setModeCard] = useState<"view" | "details" | "create" | "edit">(mode);
  const [alert, setAlert] = useState<string>("")
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [initialDate, setInitialDate] = useState<Date>(new Date());
  const [formValues, setFormValues] = useState<ProductType>(product);

  useEffect(() => {
    setFormValues(product)
    setInitialDate(new Date())
  }, [product])

  function handleDateChange(event: any, date: Date | undefined) {
    setShowPicker(false);
    if (date) {
      setInitialDate(date);
    }
  };

  const handleInputChange = (field: keyof ProductType, value: string | number) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  function handlePriceInputChange(value: string) {
    const formattedValue = value.replace(/[^0-9.,-]/g, '');

    handleInputChange('preco', formattedValue);
  }

  function formatTime(tempoMinuto: number): string {
    const minutes = Math.floor(tempoMinuto / 60);
    const seconds = tempoMinuto % 60;

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

  async function saveProduct() {

    if (!formValues.nome.trim()) {
      setAlert("O campo Nome é obrigatório.");
      return;
    }

    if (!formValues.cod_referencia) {
      setAlert("O campo Código é obrigatório.");
      return;
    }

    if (formValues.tempo_minuto <= 0) {
      setAlert("O campo Tempo de Produção deve ser maior que zero.");
      return;
    }

    if (onSave) {
      setAlert("");
      if (formValues.id_produto_local === 0) {
        setModeCard("view");
        onSave(formValues, initialDate);
      }
      else{
        Alert.alert("Alterar valor do produto?", `Deseja realmente alterar o valor desse produto a partir do dia ${initialDate.toLocaleDateString()}? \n\nTodas as produções a partir deste dia terão seus valores atualizados!`, [
          {
            text: "Cancelar"
          },
          {
            text: "Confirmar",
            onPress: async () => {
              setModeCard("view");
              onSave(formValues, initialDate);
            }
          }
        ])
      }
    }
  }

  function checkEditable() {
    if (formValues.id_produto) {
      setModeCard("edit")
    }
    else {
      Alert.alert("Produto ainda não sincronizado", "Este produto ainda não foi sincronizado, por favor tente sincronizar os dados")
    }
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
            <Ionicons onPress={checkEditable} name={"create-outline"} size={35} color={colors.primary} />
            <Ionicons onPress={() => setModeCard("view")} name={"chevron-up-outline"} size={35} color={colors.primary} />
          </>
        }
        {
          modeCard === "edit"
          &&
          <>
            <Ionicons onPress={() => {
              setFormValues(product)
              setModeCard("details")
            }} name={"arrow-back-outline"} size={35} color={colors.primary} />
            {/* <Ionicons onPress={() => {
              console.log("Excluindo");
            }} name={"trash-outline"} size={35} color={colors.error} /> */}
          </>
        }
      </View>

      {
        (modeCard === "create" || modeCard === "edit") ?
          (
            <View style={styles.cardOpenedDetails}>
              {alert && <Text style={{ color: colors.error }}>{alert}</Text>}
              <View style={styles.line}>
                <View style={{ flex: 2 }}>
                  <Input
                    placeholder="Nome do produto"
                    label="Nome"
                    placeholderTextColor={colors.textInput}
                    value={formValues.nome}
                    onChangeText={value => handleInputChange('nome', value)}
                    style={[styles.inputValue, { flex: 1 }]}
                    multiline
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Input
                    placeholder="Código"
                    label="Código"
                    value={formValues.cod_referencia.toString()}
                    onChangeText={value => handleInputChange('cod_referencia', Number(value))}
                    keyboardType="numeric"
                    style={[styles.inputValue]}
                    placeholderTextColor={colors.textInput}
                  />
                </View>
              </View>
              <Input
                placeholder="Digite uma descrição pro produto, como quantidade de materiais, medidas, etc (Opcional)"
                value={formValues.descricao}
                label="Descrição"
                multiline
                style={[styles.inputValue, styles.textDescription]}
                onChangeText={value => handleInputChange('descricao', value)}
                placeholderTextColor={colors.textInput}
              />
              <View style={styles.line}>
                <View style={styles.valueVertical}>
                  <Text style={styles.titleText}>Valor mão{"\n"}de obra:</Text>
                  <Input
                    placeholder="Preço"
                    value={formValues.preco.toString()}
                    onChangeText={handlePriceInputChange}
                    keyboardType="numbers-and-punctuation"
                    style={[styles.inputValue, { textAlign: "center" }]}
                    placeholderTextColor={colors.textInput}
                  />

                </View>

                <View style={styles.valueVertical}>
                  <Text style={styles.titleText}>Tempo{"\n"}produção:</Text>
                  <Input
                    placeholder="Tempo"
                    value={formatTime(formValues.tempo_minuto)}
                    onChangeText={handleTimeInputChange}
                    keyboardType="numeric"
                    style={[styles.inputValue, { textAlign: "center" }]}
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
                      !isNaN(formValues.preco) && ((hourValue / 60) * formValues.tempo_minuto + Number(formValues.preco)).toFixed(2)
                    }
                  </Text>
                </View>
              </View>
              {
                modeCard === "edit" &&
                <Pressable
                  style={styles.dataContainer}
                  onPress={() => setShowPicker(!showPicker)}
                >
                  <Text style={styles.dataText}>Alterar partir de: </Text>
                  <View style={styles.dataValue}>
                    <Text style={styles.dataText}>{initialDate?.toLocaleDateString()}</Text>
                  </View>
                </Pressable>
              }
              {showPicker && (
                <DateTimePicker
                  value={initialDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
              <View style={styles.buttonsContainer}>
                {
                  modeCard === "create" &&
                  <Button
                    style={{ flex: 1 }}
                    title="Cancelar"
                    onPress={async () => {
                      if (onCancel) {
                        onCancel();
                      }
                    }}
                  />
                }
                <Button
                  style={{ flex: 1 }}
                  title="Salvar"
                  onPress={saveProduct} />
              </View>
            </View>
          )
          :
          modeCard === "view" ?
            (
              <Pressable onPress={() => setModeCard("details")}>
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
                        !isNaN(formValues.preco) && ((hourValue / 60) * formValues.tempo_minuto + Number(formValues.preco)).toFixed(2)
                      }
                    </Text>
                  </View>
                  <View style={styles.buttonOpen}>
                    <Ionicons name={"chevron-down-outline"} size={35} color={colors.primary} />
                  </View>
                </View>
              </Pressable>
            )
            :
            (
              <View style={styles.cardOpenedDetails}>
                <View style={styles.line}>
                  <Text style={[styles.textValue, { flex: 1 }]}>{formValues.nome}</Text>
                  <Text style={[styles.textValue, { textAlign: "center" }]}>Cod.{`\n`}{formValues.cod_referencia}</Text>
                </View>
                <View style={styles.line}>
                  <View style={styles.textDescription}>
                    <Text style={[styles.textValue, { fontSize: 14 }]}>{formValues.descricao}</Text>
                  </View>
                </View>
                <View style={styles.line}>

                  <View style={styles.valueVertical}>
                    <Text style={styles.titleText}>Valor mão{"\n"}de obra:</Text>
                    <Text style={styles.textValue}>R${(Number(formValues.preco).toFixed(2))}</Text>
                  </View>

                  <View style={styles.valueVertical}>
                    <Text style={styles.titleText}>Tempo{"\n"}produção:</Text>
                    <Text style={styles.textValue}>{String(formatTime(formValues.tempo_minuto).padStart(2, '0'))}</Text>
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
                        !isNaN(formValues.preco) && ((hourValue / 60) * formValues.tempo_minuto + Number(formValues.preco)).toFixed(2)
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
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
    borderBottomColor: "white",
    borderBottomWidth: 1,
    minHeight: 80,
    flex: 1
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
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  dataContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  dataValue: {
    padding: 12,
    backgroundColor: colors.backgroundInput,
    borderBottomColor: colors.text,
    borderBottomWidth: 1,
    borderRadius: 4,
    alignItems: "center",
  },
  dataText: {
    fontSize: 16,
    color: colors.text,
  },
})