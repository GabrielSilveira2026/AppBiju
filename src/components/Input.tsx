import React, { useState, forwardRef, Ref } from 'react';
import { StyleSheet, TextInput, View, Text, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import { colors } from '../../styles/color';
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
    <View style={{
      flexGrow: 1
    }}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputLine}>
        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry && !verSenha}
          textContentType={textContentType}
          placeholderTextColor={colors.textInput}
          {...rest}
        />
        {
          textContentType === "password" &&
          <Ionicons style={styles.verSenha} size={35} onPress={() => {
            setVerSenha(!verSenha)
          }} name={verSenha ? "eye-off-outline" : "eye-outline"} />
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputLine: {
    flexDirection: "row",
    backgroundColor: colors.backgroundInput,
    borderBottomColor: colors.text,
    borderBottomWidth: 1,
    borderRadius: 4,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "regular"
  },
  input: {
    // flex: 1,
    color: colors.text,
    fontSize: 16,
    padding: 12
  },
  verSenha: {
    color: colors.text,
    padding: 8,
    textAlignVertical: "center",
  }
});

