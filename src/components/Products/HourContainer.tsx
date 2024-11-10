import { useAuthContext } from '@/src/contexts/AuthContext';
import { colors } from '@/styles/color';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, TouchableOpacity } from 'react-native'
import Button from '../Button';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../Input';
import DateTimePicker from '@react-native-community/datetimepicker';
import { globalStyles } from '@/styles/styles';
import { constants } from '@/src/constants/constants';
import DatePicker from '../DatePicker';

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
            <View style={styles.line}>
                {modeHourValue === "edit" && (
                    <TouchableOpacity onPress={() => {
                        setHourValue(hourValueProp);
                        setModeHourValue("view");
                    }}>
                        <Ionicons name="arrow-back-outline" size={35} color={colors.primary} />
                    </TouchableOpacity>
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
                    <TouchableOpacity onPress={() => setModeHourValue("edit")}>
                        <Ionicons name="create-outline" size={35} color={colors.primary} />
                    </TouchableOpacity>
                )}
            </View>
            {modeHourValue === "edit" && (
                <View style={styles.secondLine}>
                    <View style={styles.line}>
                        <Text style={styles.dataText}>A partir de: </Text>
                        <DatePicker date={initialDate} onDateChange={setInitialDate} />
                    </View>
                    <Button title={"Salvar"} onPress={handleUpdateHourValue} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    line: {
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
