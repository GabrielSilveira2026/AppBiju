import { ProductType } from '@/src/types/types'
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, Pressable, Alert, TouchableOpacity } from 'react-native'
import { Input } from '../Input';
import { colors } from '@/styles/color';
import { Ionicons } from '@expo/vector-icons';
import Button from '../Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import { globalStyles } from '@/styles/styles';
import { formatMinutesToHours } from '@/src/utils/utils';
import InputDuration from '../InputDuration';
import { useAuthContext } from '@/src/contexts/AuthContext';
import { constants } from '@/src/constants/constants';
import DatePicker from '../DatePicker';

type CardProductProps = {
  product: ProductType;
  mode?: "view" | "details" | "create" | "edit";
  hourValue: number;
  onCancel?: () => void;
  onSave?: (product: ProductType, initialDate: Date) => void;
  onDelete: (id_product: string) => void
};

export default function CardProduct({ onSave, onCancel, onDelete, hourValue, product, mode = "view" }: CardProductProps) {
  const { user } = useAuthContext()
  const [modeCard, setModeCard] = useState<"view" | "details" | "create" | "edit">(mode);
  const [alert, setAlert] = useState<string>("")
  const [initialDate, setInitialDate] = useState<Date>(new Date());
  const [productValues, setFormValues] = useState<ProductType>(product);

  useEffect(() => {
    setModeCard(mode)
    setFormValues(product)
    setInitialDate(new Date())
  }, [product])

  const handleInputChange = (field: keyof ProductType, value: string | number) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  function handlePriceInputChange(value: string) {
    let formattedValue = value.replace(/[^0-9,.-]/g, '');

    formattedValue = formattedValue.replace(',', '.');

    handleInputChange('preco', formattedValue);
  }

  async function saveProduct() {

    if (!productValues.nome.trim()) {
      setAlert("O campo Nome é obrigatório.");
      return;
    }

    if (!productValues.cod_referencia) {
      setAlert("O campo Código é obrigatório.");
      return;
    }

    if (onSave) {
      setAlert("");
      if (productValues.id_produto === "") {
        setModeCard("view");
        onSave(productValues, initialDate);
      }
      else {
        Alert.alert("Alterar valor do produto?", `Deseja realmente alterar o valor desse produto a partir do dia ${initialDate.toLocaleDateString()}? \n\nTodas as produções a partir deste dia terão seus valores atualizados!`, [
          {
            text: "Cancelar"
          },
          {
            text: "Confirmar",
            onPress: async () => {
              setModeCard("view");
              onSave(productValues, initialDate);
            }
          }
        ])
      }
    }
  }

  async function deleteProduct() {
    if (productValues.id_produto !== "") {
      Alert.alert("Deletar produto?", `Deseja realmente deletar esse produto?`, [
        {
          text: "Cancelar"
        },
        {
          text: "Confirmar",
          onPress: async () => {
            onDelete(productValues.id_produto);
          }
        }
      ])
    }
  }

  if (modeCard === "view") {
    return (
      <Pressable style={[globalStyles.cardContainer, styleViews.cardContainer]} onPress={() => setModeCard("details")}>
        <View style={styles.line}>
          <View style={styleViews.nameAndCode}>
            <View style={styleViews.textContainer}>
              <Text style={styles.textValue}>{productValues.nome}</Text>
            </View>
            <View style={styleViews.textContainer}>
              <Text style={styles.textValue}>Cod. {productValues.cod_referencia}</Text>
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
                !isNaN(productValues.preco) && ((hourValue / 60) * productValues.tempo_minuto + Number(productValues.preco)).toFixed(2)
              }
            </Text>
          </View>
          <View style={styles.buttonOpen}>
            <Ionicons name={"chevron-down-outline"} size={35} color={colors.primary} />
          </View>
        </View>
      </Pressable>
    )
  }
  else if (modeCard === "details") {
    return (
      <View style={[globalStyles.cardContainer, { borderWidth: 1, borderColor: colors.text }]}>
        <View style={styles.cardOpened}>
          <View style={styles.line}>
            <TouchableOpacity onPress={() => setModeCard("edit")} style={{ flex: 1 }}>
              <Ionicons name="create-outline" size={35} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModeCard("view")} style={{ flex: 5, alignItems: 'flex-end' }}>
              <Ionicons name="chevron-up-outline" size={35} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.line}>
            <Text style={[styles.textValue, { flex: 1 }]}>{productValues.nome}</Text>
            <Text style={[styles.textValue, { textAlign: "center" }]}>Cod.{`\n`}{productValues.cod_referencia}</Text>
          </View>
          <View style={styles.line}>
            <View style={stylesCreateAndEdit.textDescription}>
              <Text style={[styles.textValue, { fontSize: 14 }]}>{productValues.descricao}</Text>
            </View>
          </View>
          <View style={styles.line}>

            <View style={styles.valueVertical}>
              <Text style={styles.titleText}>Valor mão{"\n"}de obra:</Text>
              <Text style={styles.textValue}>R${(Number(productValues.preco).toFixed(2))}</Text>
            </View>

            <View style={styles.valueVertical}>
              <Text style={styles.titleText}>Tempo{"\n"}produção:</Text>
              <Text style={styles.textValue}>{formatMinutesToHours(productValues.tempo_minuto)}</Text>
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
                  !isNaN(productValues.preco) && ((hourValue / 60) * productValues.tempo_minuto + Number(productValues.preco)).toFixed(2)
                }
              </Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
  else { //Create and Edit
    return (
      <View style={[globalStyles.cardContainer, stylesCreateAndEdit.cardContainer]}>
        {
          modeCard === "edit" &&
          <View style={styles.line}>
            <TouchableOpacity onPress={() => {
              setFormValues(product);
              setModeCard("details");
            }}>
              <Ionicons name="arrow-back-outline" size={35} color={colors.primary} />
            </TouchableOpacity>

            {user?.id_perfil === constants.perfil.suporte.id_perfil && (
              <TouchableOpacity onPress={deleteProduct}>
                <Ionicons name="trash-outline" size={35} color={colors.error} />
              </TouchableOpacity>
            )}

          </View>
        }
        {alert && <Text style={{ color: colors.error }}>{alert}</Text>}
        <View style={styles.line}>
          <View style={{ flex: 2 }}>
            <Input
              placeholder="Nome do produto"
              label="Nome"
              placeholderTextColor={colors.textInput}
              value={productValues.nome}
              onChangeText={value => handleInputChange('nome', value)}
              style={[styles.inputValue, { flex: 1 }]}
              multiline
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              placeholder="Código"
              label="Código"
              value={String(productValues.cod_referencia || "").replace(/[^0-9,.-]/g, '')}
              onChangeText={value => handleInputChange('cod_referencia', Number(value))}
              selectTextOnFocus={true}
              keyboardType="numeric"
              style={[styles.inputValue]}
              placeholderTextColor={colors.textInput}
            />
          </View>
        </View>
        <View style={styles.line}>
          <Input
            placeholder="Digite uma descrição pro produto, como quantidade de materiais, medidas, etc (Opcional)"
            value={productValues.descricao}
            label="Descrição"
            multiline
            style={[styles.inputValue, stylesCreateAndEdit.textDescription]}
            onChangeText={value => handleInputChange('descricao', value)}
            placeholderTextColor={colors.textInput}
          />
        </View>
        <View style={styles.line}>
          <View style={styles.valueVertical}>
            <Text style={styles.titleText}>Valor mão{"\n"}de obra:</Text>
            <Input
              placeholder="Preço"
              value={String(productValues.preco || "")}
              onChangeText={handlePriceInputChange}
              keyboardType="number-pad"
              selectTextOnFocus={true}
              style={[styles.inputValue, { textAlign: "center" }]}
              placeholderTextColor={colors.textInput}
            />
          </View>

          <View style={styles.valueVertical}>
            <Text style={styles.titleText}>Tempo{"\n"}produção:</Text>
            <View style={{ flexDirection: "row" }}>
              <InputDuration
                value={productValues.tempo_minuto}
                onChange={(value) => handleInputChange('tempo_minuto', value)}
              />
            </View>
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
                !isNaN(productValues.preco) && ((hourValue / 60) * productValues.tempo_minuto + Number(productValues.preco)).toFixed(2)
              }
            </Text>
          </View>
        </View>
        {
          modeCard === "edit" &&
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <Text style={styles.dataText}>Alterar partir de: </Text>
            <DatePicker date={initialDate} onDateChange={setInitialDate} />
          </View>
        }
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
      </View >
    )
  }
}

const styles = StyleSheet.create({
  line: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  textValue: {
    fontSize: 16,
    color: colors.text,
  },
  buttonOpen: {
    padding: 8
  },
  cardOpened: {
    padding: 8,
    gap: 8,
  },
  valueVertical: {
    padding: 8,
    gap: 8,
    alignItems: "center",
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

const stylesCreateAndEdit = StyleSheet.create({
  cardContainer: {
    padding: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.primary
  },
  textDescription: {
    borderBottomColor: colors.text,
    borderBottomWidth: 1,
    minHeight: 80,
    flex: 1
  }
})

const styleViews = StyleSheet.create({
  cardContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.text
  },
  nameAndCode: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-between"
  },
  textContainer: {
    padding: 8
  },
  iconsLine: {
    paddingHorizontal: 8
  }
})