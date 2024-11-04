import { useAuthContext } from '@/src/contexts/AuthContext';
import { colors } from '@/styles/color';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native'
import Button from '../Button';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../Input';
import DateTimePicker from '@react-native-community/datetimepicker';
import { globalStyles } from '@/styles/styles';
import { constants } from '@/src/constants/constants';

type HourContainerProps = {
    hourValueProp: string;
    onUpdateHourValue: (newHourValue: string, date: string) => Promise<void>;
};

export default function HourContainer({ hourValueProp, onUpdateHourValue }: HourContainerProps) {
    const { user } = useAuthContext();
    const isFocused = useIsFocused();
    const [hourValue, setHourValue] = useState<string>(hourValueProp);
    const [modeHourValue, setModeHourValue] = useState<"view" | "edit">("view");
    const [initialDate, setInitialDate] = useState<Date>(new Date());
    const [showPicker, setShowPicker] = useState<boolean>(false);

    useEffect(() => {
        if (isFocused) {
            setHourValue(hourValueProp);
            setModeHourValue("view");
        }
    }, [hourValueProp, isFocused]);

    function handleDateChange(event: any, date: Date | undefined) {
        setShowPicker(false);
        if (date) {
            setInitialDate(date);
        }
    };

    async function handleUpdateHourValue() {
        Alert.alert('Alterar valor da hora?', `Deseja realmente alterar o valor da hora a partir do dia ${initialDate.toLocaleDateString()}? \n\nTodas as produções a partir deste dia terão seus valores atualizados!`, [
            {
                text: 'Cancelar'
            },
            {
                text: 'Confirmar',
                onPress: async () => {
                    await onUpdateHourValue(hourValue, initialDate.toLocaleDateString());
                    setModeHourValue("view");
                }
            }
        ]);
    }

    return (
        <View style={[globalStyles.cardContainer, { gap: 12 }]}>
            <View style={styles.firstLine}>
                {modeHourValue === "edit" && (
                    <Ionicons onPress={() => {
                        setHourValue(hourValueProp)
                        setModeHourValue("view")
                    }} name={"arrow-back-outline"} size={35} color={colors.primary} />
                )}
                <Text style={styles.hourText}>Valor Hora: R$</Text>
                {modeHourValue === "view" ? (
                    <Text style={styles.hourText}>{hourValue}</Text>
                ) : (
                    <View>
                        <Input
                            value={hourValue.toString()}
                            onChangeText={(text) => setHourValue(text)}
                            keyboardType="number-pad"
                            autoCapitalize="none"
                            style={styles.hourValue}
                        />
                    </View>
                )}
                {user?.id_perfil !== constants.perfil.funcionario.id_perfil && modeHourValue === "view" && (
                    <Ionicons onPress={() => setModeHourValue("edit")} name={"create-outline"} size={35} color={colors.primary} />
                )}
            </View>
            {modeHourValue === "edit" && (
                <View style={styles.secondLine}>
                    <Pressable
                        style={styles.dataContainer}
                        onPress={() => setShowPicker(!showPicker)}
                    >
                        <Text style={styles.dataText}>A partir de: </Text>
                        <View style={styles.dataValue}>
                            <Text style={styles.dataText}>{initialDate?.toLocaleDateString()}</Text>
                        </View>
                    </Pressable>
                    <Button title={"Salvar"} onPress={handleUpdateHourValue} />
                </View>
            )}
            {showPicker && (
                <DateTimePicker
                    value={initialDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    firstLine: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8
    },
    secondLine: {
        gap: 12
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
    hourText: {
        fontSize: 16,
        color: colors.text
    },
    hourValue: {
        flexGrow: 0,
        color: colors.text,
        fontSize: 16,
        padding: 8
    }
});
