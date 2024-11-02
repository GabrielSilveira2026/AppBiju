import { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { TimerPickerModal } from 'react-native-timer-picker';
import { Input } from './Input';
import { formatMinutesToHours } from '../utils/utils';
import { colors } from '@/styles/color';

type InputDurationProps = {
    value: number;
    onChange: (minutes: number) => void;
};

export default function InputDuration({ onChange, value }: InputDurationProps) {
    const [showPicker, setShowPicker] = useState(false);

    const handleTimeSelection = ({ hours, minutes }: { hours: number; minutes: number }) => {
        const totalMinutes = hours * 60 + minutes;
        onChange(totalMinutes);
        setShowPicker(false)
    };

    const togglePicker = () => setShowPicker(prev => !prev);

    return (
        <Pressable onPress={togglePicker} style={styles.container}>
            <Pressable onPress={togglePicker}>
                <Input
                    placeholder="Tempo"
                    value={formatMinutesToHours(value)}
                    onChangeText={() => { }}
                    editable={false}
                    inputStyle={{ flex: 1, textAlign: "center" }}
                />
            </Pressable>
            <TimerPickerModal
                visible={showPicker}
                setIsVisible={setShowPicker}
                onConfirm={handleTimeSelection}
                onCancel={() => setShowPicker(false)}
                hideSeconds
                initialHours={22}
                cancelButtonText='Cancelar'
                confirmButtonText='  Salvar  '
                styles={{
                    theme: 'dark',
                    confirmButton: styles.button,
                    cancelButton: styles.button
                }}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    inputValue: {
        fontSize: 16,
        padding: 8,
        color: colors.text,
        textAlign: 'center', // Centraliza o texto
    },
    button: {
        backgroundColor: "transparent",
        borderColor: colors.primary,
        borderWidth: 1,
        paddingVertical: 8,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.primary
    }
});
