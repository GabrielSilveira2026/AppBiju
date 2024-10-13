import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../styles/color';

type ButtonProps = {
  title: string;
  onPress?: () => Promise<void>;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const Button: React.FC<ButtonProps> = ({ title, onPress, style, textStyle }) => {
  const [isloading, setIsloading] = useState(false);

  const handlePress = async () => {
    
    if (onPress) {
      setIsloading(true);
      try {
        await onPress();
      } catch (error) {
        console.error('Erro ao executar onPress:', error);
      } finally {
        setIsloading(false);
      }
    }
  };

  return (
    <TouchableOpacity style={[styles.button, style]} activeOpacity={0.6} onPress={handlePress} disabled={isloading} >
      <Text style={[styles.buttonText, textStyle]}>
        {isloading ? 'Carregando...' : title}
      </Text>
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
