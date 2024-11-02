import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { TimerPickerModal } from 'react-native-timer-picker';
import { Input } from './Input';
import { formatMinutesToHours } from '../utils/utils';
import { colors } from '@/styles/color';

type InputDurationProps = {
    value: number,
    onChange: (minutes: number) => void
}

export default function InputDuration({ onChange, value }: InputDurationProps) {
    const [showPicker, setShowPicker] = useState(false);

    function formatTimer({ hours, minutes, seconds }: { hours: number, minutes: number, seconds: number }) {
        const tempo = String((hours * 60) + (minutes))
        onChange(Number(tempo))
    }

    console.log(value);
    

    return (
        <View style={{ flex: 1 }}>
            <Pressable onPress={() => setShowPicker(!showPicker)}>
                <Input
                    placeholder="Tempo"
                    value={formatMinutesToHours(Number(value))}
                    onChangeText={() => { }}
                    editable={false}
                    style={[styles.inputValue, { textAlign: "center" }]} />
            </Pressable>
            <TimerPickerModal
                visible={showPicker}
                setIsVisible={setShowPicker}
                onConfirm={(pickedDuration) => {
                    formatTimer(pickedDuration);
                    setShowPicker(!showPicker)
                }}
                onCancel={() => setShowPicker(false)}
                closeOnOverlayPress
                hideSeconds
                styles={{
                    theme: "dark",
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    inputValue: {
        fontSize: 16,
        padding: 8,
        color: colors.text,
    },
})