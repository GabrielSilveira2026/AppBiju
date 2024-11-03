import { useState } from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
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

    const initialHours = Math.floor(value / 60);
    const initialMinutes = value % 60;

    const togglePicker = () => setShowPicker(prev => !prev);

    return (
        <View style={styles.container}>
            <Pressable style={styles.button} onPress={togglePicker}>
                <Text style={styles.inputValue}>{formatMinutesToHours(value)}</Text>
            </Pressable>
            <TimerPickerModal
                visible={showPicker}
                setIsVisible={setShowPicker}
                onConfirm={handleTimeSelection}
                onCancel={() => setShowPicker(false)}
                hideSeconds
                initialHours={initialHours}
                initialMinutes={initialMinutes}
                cancelButtonText='Cancelar'
                confirmButtonText='  Salvar  '
                styles={{
                    theme: 'dark',
                    confirmButton: styles.buttons,
                    cancelButton: styles.buttons
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1
    },
    button: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: colors.backgroundInput,
        borderBottomColor: colors.text,
        borderBottomWidth: 1,
        borderRadius: 4,
    },
    inputValue: {
        fontSize: 16,
        padding: 8,
        color: colors.text,
        textAlign: 'center',
    },
    buttons: {
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
