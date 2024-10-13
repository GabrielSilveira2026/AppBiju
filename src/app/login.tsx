import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { globalStyles } from "@/styles/styles";
import { colors } from "../../styles/color";
import { Input } from "../components/Input";
import Button from "../components/Button";
import { Link, Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { signIn } = useAuthContext()
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [erro, setErro] = useState<string>("")

  async function login() {
    const response = await signIn(email.trim(), password.trim())
    if (response?.status === 401) {
      setErro("Email ou senha inválidos")
    }
    else if (response?.status === 571) {
      setErro("Falha na conexão")
    }
  }

  return (
    <SafeAreaView style={[globalStyles.pageContainer, { flex: 1, paddingBottom: 0 }]}>
      <View style={globalStyles.container}>
        <Text style={[globalStyles.title, { color: colors.primary }]}>
          Login
        </Text>
        {erro && <Text style={{ color: colors.error }}>{erro}</Text>}

        <View style={globalStyles.formContainer}>
          <Input
            label="Email"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            inputStyle={{ flex: 1 }}
          />
          <Input
            label="Senha"
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="password"
            autoCapitalize="none"
            onSubmitEditing={login}
            inputStyle={{ flex: 1 }}
          />
        </View>
        <Button
          title={"Entrar"}
          onPress={login}
        />
        <Text style={styles.registerRedirect}>
          Ainda não tem cadastro?
          <Link href={"/register"} style={styles.registerRedirectLink}> Clique aqui</Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  registerRedirect: {
    fontSize: 16,
    textAlign: "center",
    color: colors.text
  },
  registerRedirectLink: {
    color: colors.primary
  }
});