import React, { useState, forwardRef, Ref } from 'react';
import { StyleSheet, TextInput, View, Text, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import { colors } from '../constants/color';
import { Ionicons } from '@expo/vector-icons';

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
}, ref) => {
  const [verSenha, setVerSenha] = useState<boolean>(false)

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputLine}>
        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={verSenha}
          textContentType={textContentType}
          placeholderTextColor={colors.corTexto50}
          {...rest}
        />
        {
          textContentType === "password" &&
          <Ionicons style={styles.verSenha} size={35} onPress={() => {
            setVerSenha(!verSenha)
          }} name={!verSenha ? "eye-off-outline" : "eye-outline"} />
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputLine: {
    flexDirection: "row",
    backgroundColor: colors.fundo25,
    borderBottomColor: colors.corTexto,
    borderBottomWidth: 1,
    borderRadius: 4,
  },
  label: {
    color: colors.corTexto,
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "regular"
  },
  input: {
    flex: 1,
    color: colors.corTexto,
    fontSize: 16,
    padding: 12
  },
  verSenha: {
    color: colors.corTexto,
    padding: 8,
    textAlignVertical: "center",
  }
});

