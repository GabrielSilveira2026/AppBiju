import React, { useState } from 'react';
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
}) => {
  const [verSenha, setVerSenha] = useState<boolean>(false)

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputLine}>
        <TextInput
          style={[styles.input, inputStyle]}
          value={value.trim()}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={verSenha}
          textContentType={textContentType}
          placeholderTextColor={colors.corTexto50}
          {...rest}
        />
        {
          textContentType === "password" &&
          <Ionicons style={styles.verSenha} size={35} onPress={() =>{setVerSenha(!verSenha)}} name={verSenha ? "eye-outline" : "eye-off-outline"} />
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
    borderRadius: 4,
    fontSize: 16,
    padding: 12
  },
  verSenha:{
    color: colors.corTexto,
    paddingHorizontal: 8,
    textAlignVertical: "center",
  }
});

