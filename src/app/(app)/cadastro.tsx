import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Input } from '../../components/Input';
import Button from '../../components/Button';
import { globalStyles } from '@/styles/styles';
import { colors } from '../../constants/color';
import { Link } from 'expo-router';
import { cadastro } from '../../httpservices/pessoaApi';
import { useAuthContext } from '../../contexts/AuthContext';

export type FormType = {
  email: string;
  id_perfil: number;
  nome: string;
  perfil: string;
  senha: string
  confirmaSenha: string
};

export default function Form() {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormType>();
  const { signIn } = useAuthContext()
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [erro, setErro] = useState<string>("")

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    setErro("")
    setIsLoading(true)
    const response = await cadastro(
      {
        nome: data.nome.trim(),
        email: data.email.trim(),
        senha: data.senha.trim(),
        id_perfil: 3
      }
    )
    console.log(response);


    if (response?.status === 555) {
      if (response.data.cause.includes("ORA-00001")) {
        setErro("Email já cadastrado")
      } else if (response.data.cause.includes("ORA-02291")) {
        setErro("Falha na conexão: Tipo de perfil não encontrado")
      }
    } else if (response?.status === 571) {
      setErro("Falha na conexão")
    } else if (response?.status === 201) {
      await signIn(data.email.trim(), senha)
    }
    setIsLoading(false)
  };

  const senha = watch('senha');

  return (
    <View style={globalStyles.containerContent}>
      <KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width:"100%"}}>
        <View style={globalStyles.container}>
          <Text style={[globalStyles.title, { color: colors.primary }]}>
            Cadastro
          </Text>
          <View style={globalStyles.formContainer}
          >
            {erro && <Text style={globalStyles.error}>{erro}</Text>}
            <Controller
              control={control}
              name="nome"
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
            {errors.nome && <Text style={globalStyles.error}>{errors.nome.message}</Text>}

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
              name="senha"
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
            {errors.senha && <Text style={globalStyles.error}>{errors.senha.message}</Text>}

            <Controller
              control={control}
              name="confirmaSenha"
              rules={{
                required: 'Confirmação de senha é obrigatória',
                validate: value => value === senha || 'As senhas não coincidem'
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
            {errors.confirmaSenha && <Text style={globalStyles.error}>{errors.confirmaSenha.message}</Text>}
          </View>

          <Button title={isLoading ? "Carregando..." : "Cadastrar"} onPress={handleSubmit(onSubmit)} />
          <Text style={styles.semCadastro}>
            Já tem cadastro?
            <Link href={"/login"} style={styles.cliqueAqui}> Clique aqui</Link>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}


export const styles = StyleSheet.create({
  semCadastro:{
    fontSize: 16,
    textAlign: "center",
    color: colors.corTexto
  },
  cliqueAqui:{
    color: colors.primary
  }
});