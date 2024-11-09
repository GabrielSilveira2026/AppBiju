import { colors } from '@/styles/color';
import { globalStyles } from '@/styles/styles';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native'

type AddContainerProps = {
    text: string;
    onPress: () => void | Promise<void>;
    disable: boolean
};

export default function AddContainer({ disable, text, onPress }: AddContainerProps) {
    return (
        <View style={globalStyles.containerButtonBottom}>
            <TouchableOpacity
                onPress={onPress}
                style={globalStyles.buttonAdd}
                disabled={disable}
            >
                <Text style={{ color: colors.primary, textDecorationLine: "underline" }}>{text}</Text>
                <Ionicons
                    name="add-circle-outline"
                    color={colors.primary}
                    size={50} />
            </TouchableOpacity>
        </View>
    )
}