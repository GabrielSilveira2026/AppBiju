import React from 'react';
import { StyleSheet, TextInput, View, Text, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import { colors } from '../constants/color';

type InputProps = {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
} & TextInputProps;

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  containerStyle,
  inputStyle,
  textContentType,
  ...rest
}) => {
  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        textContentType={textContentType}
        placeholderTextColor={colors.corTexto50}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: colors.corTexto,
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    color: colors.corTexto,
    borderBottomColor: colors.corTexto,
    borderBottomWidth: 1,
    borderRadius: 4,
    fontSize: 16,
    padding: 8
  }
});

