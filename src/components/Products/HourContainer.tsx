import { useAuthContext } from '@/src/contexts/AuthContext';
import { useSync } from '@/src/contexts/SyncContext';
import { colors } from '@/styles/color';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native'
import Button from '../Button';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../Input';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function HourContainer() {
    const { user } = useAuthContext();
    const sync = useSync()
    const isFocused = useIsFocused();
    const [hourValue, setHourValue] = useState<string>("0")
    const [modeHourValue, setModeHourValue] = useState<"view" | "edit">("view")
    const [initialDate, setInitialDate] = useState<Date>(new Date());
    const [showPicker, setShowPicker] = useState<boolean>(false)

    useEffect(() => {
        async function getHourValue() {
            const response = await sync.getHourValue()
            setHourValue(response.response[0].valor.toString())
        }

        if (isFocused) {
            setModeHourValue("view")
            getHourValue()
        }
    }, [isFocused]);

    function handleDateChange(event: any, date: Date | undefined) {
        setShowPicker(false)
        if (date) {
            setInitialDate(date);
        }
    };

    async function updateHourValue() {
        const response = await sync.updateHourValue(Number(hourValue), initialDate.toLocaleDateString())
        console.log(response);
        
        if (response.response.status === 200) {
            setModeHourValue("view")
        }
    }
    return (
        <View style={styles.hourContainer}>
            <View style={styles.firstLine}>
                {
                    modeHourValue === "edit" &&
                    <Ionicons onPress={() => setModeHourValue("view")} name={"arrow-back-outline"} size={35} color={colors.primary} />
                }
                <Text style={styles.hourText}>Valor Hora: R$</Text>
                {
                    modeHourValue === "view" ?
                        <Text style={styles.hourText}>{hourValue}</Text>
                        :
                        <View>
                            <Input
                                value={hourValue.toString()}
                                onChangeText={(text) => setHourValue(text)}
                                keyboardType="number-pad"
                                autoCapitalize="none"
                                style={styles.hourValue}
                            />
                        </View>
                }
                {
                    user?.id_perfil !== 1 &&
                    modeHourValue === "view" &&
                    <Ionicons onPress={() => setModeHourValue("edit")} name={"create-outline"} size={35} color={colors.primary} />
                }
            </View>
            {
                modeHourValue === "edit" &&
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

                    <Button title={"Salvar"} onPress={updateHourValue} />
                </View>
            }
            {
                showPicker
                &&
                <DateTimePicker
                    value={initialDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            }
        </View>
    )
}
const styles = StyleSheet.create({

    hourContainer: {
        padding: 12,
        borderRadius: 4,
        backgroundColor: colors.backgroundTertiary,
        gap: 12
    },
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
        fontSize: 20,
        color: colors.text,
    },
    hourText: {
        fontSize: 20,
        color: colors.text
    },
    hourValue: {
        flexGrow: 0,
        color: colors.text,
        fontSize: 20,
        padding: 8
    }

})
