import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, ImageBackground, TouchableOpacity, Alert } from "react-native";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { globalStyles } from "@/styles/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { colors } from "@/styles/color";
import { Input } from "@/src/components/Input";
import Button from "@/src/components/Button";
import { getPeople, updatePeople } from "@/src/httpservices/user";
import { useIsFocused } from "@react-navigation/native";
import { IMAGE_PATHS } from "@/styles/constants";
import { Ionicons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";

export type FormType = {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
};

export default function ProfileForm() {
    const { control, handleSubmit, watch, reset, formState: { errors } } = useForm<FormType>();
    const { signOut } = useAuthContext();
    const { user } = useAuthContext();
    const [error, setError] = useState<string>("");
    const password = watch("password");
    const isFocused = useIsFocused();
    const database = useSQLiteContext();

    const [editStates, setEditStates] = useState({
        name: false,
        email: false,
        password: false,
    });

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const response = await getPeople(user?.id_pessoa);
                if (response.status === 200) {
                    reset({
                        name: response.data.items[0].nome,
                        email: response.data.items[0].email,
                        password: "",
                        confirmPassword: "",
                    });
                } else {
                    setError("Erro ao carregar informações do perfil.");
                }
            } catch (e) {
                setError("Falha na conexão.");
            }
        }

        if (isFocused) {
            fetchUserProfile();
        } else {
            setError("");
        }
    }, [isFocused, user?.id_pessoa, reset]);

    const onSubmit: SubmitHandler<FormType> = async (data) => {
        try {
            setError("")
            if (user?.id_pessoa) {
                const response = await updatePeople({
                    id_pessoa: user?.id_pessoa,
                    id_perfil: user?.id_perfil,
                    nome: data.name.trim(),
                    email: data.email.trim(),
                    senha: data.password.trim(),
                });

                if (response?.status === 555) {
                    if (response.data.cause.includes("ORA-00001")) {
                        setError("Email já cadastrado");
                    } else if (response.data.cause.includes("ORA-02291")) {
                        setError("Falha na conexão: Tipo de perfil não encontrado");
                    }
                } else if (response?.status === 571) {
                    setError("Falha na conexão");
                } else {
                    setError("")
                    setEditStates({
                        name: false,
                        email: false,
                        password: false,
                    })
                }
            }
        } catch (e) {
            setError("Falha na conexão.");
        }
    };


    async function logout() {
        Alert.alert("Sair?", "Deseja sair da sua conta?", [
            {
                text: "Cancelar"
            },
            {
                text: "Confirmar",
                onPress: async () => {
                    const tables: { name: string }[] = await database.getAllAsync(`SELECT name FROM sqlite_master WHERE type="table"`);
                    for (const table of tables) {
                        await database.execAsync(`DELETE FROM ${table.name}`);
                    }
                    signOut();
                }
            }
        ])
    }

    const toggleEdit = (field: "name" | "email" | "password") => {
        setEditStates((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    return (
        <ImageBackground source={IMAGE_PATHS.backgroundImage} style={globalStyles.backgroundImage}>
            <SafeAreaView style={[globalStyles.pageContainer, { flex: 1, paddingBottom: 0 }]}>
                <ScrollView style={{ flexGrow: 0, width: "100%" }}>
                    <View style={globalStyles.container}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <Text style={[globalStyles.title, { color: colors.primary }]}>
                                Perfil
                            </Text>
                            <TouchableOpacity onPress={logout}>
                                <Ionicons name={"exit-outline"} size={30} color={colors.error} />
                            </TouchableOpacity>
                        </View>
                        {error && <Text style={{ color: error === "Dados atualizados" ? colors.primary : colors.error }}>{error}</Text>}

                        <View style={globalStyles.formContainer}>
                            {error && <Text style={{ color: colors.error }}>{error}</Text>}

                            <View style={styles.inputContainer}>
                                {editStates.name ? (
                                    <Controller
                                        control={control}
                                        name="name"
                                        rules={{ required: "Nome é obrigatório" }}
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
                                ) : (
                                    <Text style={styles.text}>Nome: {watch("name")}</Text>
                                )}
                                <TouchableOpacity onPress={() => toggleEdit("name")}>
                                    <Ionicons name={editStates.name ? "arrow-back-outline" : "create-outline"} size={30} color={colors.primary} />
                                </TouchableOpacity>
                            </View>
                            {errors.name && <Text style={{ color: colors.error }}>{errors.name.message}</Text>}

                            <View style={styles.inputContainer}>
                                {editStates.email ? (
                                    <Controller
                                        control={control}
                                        name="email"
                                        rules={{
                                            required: "Email é obrigatório",
                                            pattern: {
                                                value: /\S+@\S+\.\S+/,
                                                message: "Formato de email inválido",
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
                                ) : (
                                    <Text style={styles.text}>Email: {watch("email")}</Text>
                                )}
                                <TouchableOpacity onPress={() => toggleEdit("email")}>
                                    <Ionicons name={editStates.email ? "arrow-back-outline" : "create-outline"} size={30} color={colors.primary} />
                                </TouchableOpacity>
                            </View>
                            {errors.email && <Text style={{ color: colors.error }}>{errors.email.message}</Text>}

                            <View style={styles.inputContainer}>
                                {editStates.password ? (
                                    <Controller
                                        control={control}
                                        name="password"
                                        rules={{ required: "Senha é obrigatória" }}
                                        render={({ field: { onChange, value } }) => (
                                            <Input
                                                label="Senha"
                                                placeholder="Digite sua senha"
                                                value={value}
                                                onChangeText={onChange}
                                                secureTextEntry={true}
                                                textContentType="password"
                                                inputStyle={{ flex: 1 }}
                                            />
                                        )}
                                    />
                                ) : (
                                    <Text style={styles.text}>Senha: ******</Text>
                                )}
                                <TouchableOpacity onPress={() => toggleEdit("password")}>
                                    <Ionicons name={editStates.password ? "arrow-back-outline" : "create-outline"} size={30} color={colors.primary} />
                                </TouchableOpacity>
                            </View>
                            {errors.password && <Text style={{ color: colors.error }}>{errors.password.message}</Text>}
                        </View>

                        {(editStates.name || editStates.email || editStates.password) && (
                            <Button title={"Salvar"} onPress={handleSubmit(onSubmit)} />
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        marginVertical: 10,
    },
    text: {
        fontSize: 16,
        color: colors.text,
        flex: 1,
    }
});
