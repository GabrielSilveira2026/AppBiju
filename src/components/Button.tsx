import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../styles/color';

type ButtonProps = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const Button: React.FC<ButtonProps> = ({ title, onPress, style, textStyle }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} activeOpacity={0.6} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "transparent",
    borderColor: colors.primary,
    borderWidth: 1,
    paddingVertical: 8,      
    borderRadius: 4,            
    alignItems: 'center',       
    justifyContent: 'center',   
  },
  buttonText: {
    color: colors.primary,    
    fontSize: 16,      
    fontWeight: 'semibold',
  },
});

export default Button;
