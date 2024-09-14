import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { globalStyles } from "@/styles/styles";
import { colors } from "../constants/color";
import { Input } from "../components/Input";
import Button from "../components/Button";
import { Link, Redirect } from "expo-router";

export default function HomeScreen() {
  const { signIn } = useAuthContext()
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [erro, setErro] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function login() {
    setIsLoading(true)
    const response = await signIn(email.trim(), senha.trim())
    setIsLoading(false)
    if (response?.status === 401) {
      setErro("Email ou senha inválidos")
    }
    else if (response?.status === 571) {
      setErro("Falha na conexão")
    }
  }

  return (
    <View style={globalStyles.containerContent}>
      <View style={globalStyles.container}>
        <Text style={[globalStyles.title, { color: colors.primary }]}>
          Login
        </Text>
        {erro && <Text style={globalStyles.error}>{erro}</Text>}

        <View style={globalStyles.formContainer}>
          <Input
            label="Email"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          <Input
            label="Senha"
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            textContentType="password"
            autoCapitalize="none"
            onSubmitEditing={login}
          />
        </View>
        <Button
          title={isLoading ? "Carregando..." : "Entrar"}
          onPress={login}
        />
        <Text style={styles.semCadastro}>
          Ainda não tem cadastro?
          <Link href={"/cadastro"} style={styles.cliqueAqui}> Clique aqui</Link>
        </Text>
      </View>
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