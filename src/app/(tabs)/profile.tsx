import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { globalStyles } from '@/styles/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthContext } from '@/src/contexts/AuthContext';
import { colors } from '@/styles/color';
import { Input } from '@/src/components/Input';
import Button from '@/src/components/Button';
import { getPeople, updatePeople } from '@/src/httpservices/user';
import { useIsFocused } from '@react-navigation/native';
import { IMAGE_PATHS } from '@/styles/constants';
import { Ionicons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';

export type FormType = {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
};

export default function ProfileForm() {
    const { control, handleSubmit, watch, reset, formState: { errors } } = useForm<FormType>();
    const { signOut } = useAuthContext()
    const { user } = useAuthContext();
    const [error, setError] = useState<string>('');
    const password = watch('password');
    const isFocused = useIsFocused();
    const database = useSQLiteContext()
    const [erro, setErro] = useState<string>("")

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const response = await getPeople(user?.id_pessoa);
                if (response.status === 200) {
                    reset({
                        name: response.data.items[0].nome,
                        email: response.data.items[0].email,
                        password: '',
                        confirmPassword: '',
                    });
                } else {
                    setError('Erro ao carregar informações do perfil.');
                }
            } catch (e) {
                setError('Falha na conexão.');
            }
        }


        if (isFocused) {
            fetchUserProfile();
        }
    }, [isFocused, user?.id_pessoa, reset]);

    const onSubmit: SubmitHandler<FormType> = async (data) => {
        setError('');
        try {
            if (user?.id_pessoa) {
                const response = await updatePeople({
                    id_pessoa: user?.id_pessoa,
                    nome: data.name.trim(),
                    email: data.email.trim(),
                    senha: data.password.trim(),
                });
                console.log(response);
                

                if (response?.status === 555) {
                    if (response.data.cause.includes("ORA-00001")) {
                        setErro("Email já cadastrado")
                    } else if (response.data.cause.includes("ORA-02291")) {
                        setErro("Falha na conexão: Tipo de perfil não encontrado")
                    }
                } else if (response?.status === 571) {
                    setErro("Falha na conexão")
                } else {
                    setErro("Dados atualizados")
                }
            }
        } catch (e) {
            setError('Falha na conexão.');
        }
    };

    async function logout() {
        const tables: { name: string }[] = await database.getAllAsync(`SELECT name FROM sqlite_master WHERE type='table'`);
        for (const table of tables) {
            await database.execAsync(`DELETE FROM ${table.name}`);
        }
        signOut();
    }

    return (
        <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
            <SafeAreaView style={[globalStyles.pageContainer, { flex: 1, paddingBottom: 0 }]}>
                <ScrollView style={{ flexGrow: 0, width: '100%' }}>
                    <View style={globalStyles.container}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <Text style={[globalStyles.title, { color: colors.primary }]}>
                                Perfil
                            </Text>
                            <TouchableOpacity
                                onPress={logout}
                            >
                                <Ionicons
                                    name={"exit-outline"}
                                    size={30}
                                    color={colors.error}
                                />
                            </TouchableOpacity>
                        </View>
                        {erro && <Text style={{ color: error === "Dados atualizados" ? colors.primary : colors.error }}>{erro}</Text>}

                        <View style={globalStyles.formContainer}>
                            {error && <Text style={{ color: colors.error }}>{error}</Text>}

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
                                        message: 'Formato de email inválido',
                                    },
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

                            <Controller
                                control={control}
                                name="password"
                                rules={{
                                    minLength: { value: 6, message: 'A senha deve ter no mínimo 6 caracteres' },
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        label="Senha (Opcional)"
                                        placeholder="Digite sua nova senha"
                                        value={value}
                                        onChangeText={onChange}
                                        secureTextEntry
                                        autoCapitalize="none"
                                        textContentType="password"
                                        inputStyle={{ flex: 1 }}
                                    />
                                )}
                            />
                            {errors.password && <Text style={{ color: colors.error }}>{errors.password.message}</Text>}

                            <Controller
                                control={control}
                                name="confirmPassword"
                                rules={{
                                    validate: value => value === password || 'As senhas não coincidem',
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        label="Confirme sua senha (Opcional)"
                                        placeholder="Digite sua nova senha"
                                        value={value}
                                        onChangeText={onChange}
                                        secureTextEntry
                                        textContentType="password"
                                        inputStyle={{ flex: 1 }}
                                    />
                                )}
                            />
                            {errors.confirmPassword && <Text style={{ color: colors.error }}>{errors.confirmPassword.message}</Text>}
                        </View>

                        <Button title="Salvar Alterações" onPress={handleSubmit(onSubmit)} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    semCadastro: {
        fontSize: 16,
        textAlign: 'center',
        color: colors.text,
    },
});
