import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, SafeAreaView } from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Input } from '../components/Input';
import Button from '../components/Button';
import { globalStyles } from '@/styles/styles';
import { colors } from '../../styles/color';
import { Link } from 'expo-router';
import { register } from '../httpservices/user';
import { useAuthContext } from '../contexts/AuthContext';

export type FormType = {
  email: string;
  id_perfil: number;
  name: string;
  perfil: string;
  password: string
  confirmPassword: string
};

export default function RegisterForm() {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormType>();
  const { signIn } = useAuthContext()

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [erro, setErro] = useState<string>("")

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    setErro("")
    setIsLoading(true)
    const response = await register(
      {
        nome: data.name.trim(),
        email: data.email.trim(),
        senha: data.password.trim(),
        id_perfil: 3
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
      await signIn(data.email.trim(), password)
    }
    setIsLoading(false)
  };

  const password = watch('password');

  return (
    <SafeAreaView style={globalStyles.pageContainer}>
      <ScrollView style={{ flexGrow: 0, width: "100%" }}>
        <View style={globalStyles.container}>
          <Text style={[globalStyles.title, { color: colors.primary }]}>
            Cadastro
          </Text>
          <View style={globalStyles.formContainer}
          >
            {erro && <Text style={globalStyles.error}>{erro}</Text>}
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
                />
              )}
            />
            {errors.name && <Text style={globalStyles.error}>{errors.name.message}</Text>}

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
                />
              )}
            />
            {errors.email && <Text style={globalStyles.error}>{errors.email.message}</Text>}

            <Controller
              control={control}
              name="password"
              rules={{
                required: 'Senha é obrigatória',
                minLength: { value: 6, message: 'A senha deve ter no mínimo 6 caracteres' }
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Senha"
                  placeholder="Digite sua senha"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  autoCapitalize="none"
                  textContentType="password"
                />
              )}
            />
            {errors.password && <Text style={globalStyles.error}>{errors.password.message}</Text>}

            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: 'Confirmação de senha é obrigatória',
                validate: value => value === password || 'As senhas não coincidem'
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Confirme sua senha"
                  placeholder="Digite sua senha novamente"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  textContentType="password"
                />
              )}
            />
            {errors.confirmPassword && <Text style={globalStyles.error}>{errors.confirmPassword.message}</Text>}
          </View>

          <Button title={isLoading ? "Carregando..." : "Cadastrar"} onPress={handleSubmit(onSubmit)} />
          <Text style={styles.semCadastro}>
            Já tem cadastro?
            <Link href={"/login"} style={styles.cliqueAqui}> Clique aqui</Link>
          </Text>
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