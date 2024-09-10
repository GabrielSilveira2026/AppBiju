import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { Button, Text, TextInput, View } from "react-native";
import Container from "../components/Container";
import { globalStyles } from "@/styles/styles";
import { colors } from "../constants/color";

export default function HomeScreen() {
  const { signIn } = useAuthContext()
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("")
  const [isLoading, setIsLoading] = useState(false);

  async function login() {
    setIsLoading(true)
    const response = await signIn(email.trim(), senha)
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
      <Container>
        <Text style={[globalStyles.title, {color: colors.primary}]}>
          Login
        </Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          textContentType="emailAddress"
        />
        <TextInput
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          textContentType="password"
          autoCapitalize="none"
        />

        {erro && <Text>{erro}</Text>}
        <Button
          title={isLoading ? "Carregando..." : "Login"}
          onPress={login}
        />
      </Container>
    </View>
  );
}

