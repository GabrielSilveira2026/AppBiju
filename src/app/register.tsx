import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Input } from '../components/Input';
import Button from '../components/Button';
import { globalStyles } from '@/styles/styles';
import { colors } from '../../styles/color';
import { Link, router } from 'expo-router';
import { register } from '../httpservices/user';
import { useAuthContext } from '../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { constants } from '../constants/constants';
import { Ionicons } from '@expo/vector-icons';

export type FormType = {
  email: string;
  id_perfil: number;
  name: string;
  perfil: string;
};

export default function RegisterForm() {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormType>();
  const { signIn } = useAuthContext()

  const [erro, setErro] = useState<string>("")

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    setErro("")
    const response = await register(
      {
        nome: data.name.trim(),
        email: data.email.trim(),
        id_perfil: constants.perfil.funcionario.id_perfil
      }
    )

    if (response?.status === 555) {
      if (response.data.cause.includes("ORA-00001")) {
        setErro("Email já cadastrado")
      } else if (response.data.cause.includes("ORA-02291")) {
        setErro("Falha na conexão: Tipo de perfil não encontrado")
      }
    } else if (response?.status === 571) {
      setErro("Falha na conexão")
    } else if (response?.status === 201) {
      router.navigate("/(tabs)/employees")
    }
  };

  return (
    <SafeAreaView style={[globalStyles.pageContainer, { flex: 1, paddingBottom: 0 }]}>
      <ScrollView style={{ flexGrow: 0, width: "100%" }}>
        <View style={globalStyles.container}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity onPress={() => {
              router.navigate("/(tabs)/employees")
            }}>
              <Ionicons
                name="arrow-back-outline"
                size={35}
                color={colors.primary}
              />
            </TouchableOpacity>
            <Text style={[globalStyles.title, { color: colors.primary }]}>
              Cadastro de funcionário
            </Text>
          </View>
          <View style={globalStyles.formContainer}
          >
            {erro && <Text style={{ color: colors.error }}>{erro}</Text>}
            <Controller
              control={control}
              name="name"
              rules={{ required: 'Nome é obrigatório' }}
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Nome"
                  placeholder="Digite seu nome"
                  value={value}
                  onChangeText={onChange}
                  inputStyle={{ flex: 1 }}
                />
              )}
            />
            {errors.name && <Text style={{ color: colors.error }}>{errors.name.message}</Text>}

            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email é obrigatório',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Formato de email inválido'
                }
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Email"
                  placeholder="Digite seu email"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  inputStyle={{ flex: 1 }}
                />
              )}
            />
            {errors.email && <Text style={{ color: colors.error }}>{errors.email.message}</Text>}
          </View>

          <Button title={"Cadastrar"} onPress={handleSubmit(onSubmit)} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}


export const styles = StyleSheet.create({
  semCadastro: {
    fontSize: 16,
    textAlign: "center",
    color: colors.text
  },
  cliqueAqui: {
    color: colors.primary
  }
});