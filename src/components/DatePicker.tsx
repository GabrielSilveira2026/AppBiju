import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '@/styles/color';

interface DataPickerProps {
    date: Date;
    onDateChange: (date: Date) => void;
}

export default function DatePicker({ date, onDateChange }: DataPickerProps) {
    const [showPicker, setShowPicker] = useState<boolean>(false);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowPicker(false);
        if (selectedDate) {
            selectedDate.setHours(1, 0, 0, 0);
            onDateChange(selectedDate);
        }
    };

    return (
        <>
            <TouchableOpacity style={styles.dataContainer} onPress={() => setShowPicker(!showPicker)}>
                <View style={styles.dataValue}>
                    <Text style={styles.dataText}>
                        {date?.toLocaleDateString()}
                    </Text>
                </View>
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}
        </>
    );
}

const styles = StyleSheet.create({
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
});
