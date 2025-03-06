import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { globalStyles } from "@/styles/styles";
import { colors } from "../../styles/color";
import { Input } from "../components/Input";
import Button from "../components/Button";
import { Link, Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAccess, updatePeople } from "../httpservices/user";
import { Ionicons } from "@expo/vector-icons";
import About from "../components/About";

export default function HomeScreen() {
  const { signIn } = useAuthContext()
  const [email, setEmail] = useState<string>("");
  const [idPessoa, setIdPessoa] = useState<number>();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [erro, setErro] = useState<string>("")
  const [showRegisterPassword, setShowRegisterPassword] = useState<boolean>(false)
  const [showInputPassword, setShowInputPassword] = useState<boolean>(false)

  async function login() {
    const response = await signIn(email.trim(), password.trim())
    if (response?.status === 401) {
      setErro("Email ou senha inválidos")
    }
    else if (response?.status === 571) {
      setErro("Falha na conexão")
    }
  }

  async function createPassword() {
    setErro("")
    if (idPessoa) {
      if (password === confirmPassword) {
        const response = await updatePeople({
          id_pessoa: idPessoa,
          email: email,
          senha: password.trim(),
        })

        if (response?.status === 571) {
          setErro("Falha na conexão");
        }
        else {
          login()
        }
      }
      else {
        setErro("As senhas não coincidem")
      }
    }
  }

  async function getAcesss() {
    const response = await getAccess(email)
    setErro("")

    if (response.data?.items?.length) {
      if (response.data?.items?.[0].primeiro_acesso === "true") {
        setIdPessoa(response.data?.items?.[0].id_pessoa)
        setShowRegisterPassword(true)
      } else {
        setShowInputPassword(true)
      }
    }
    else {
      setErro("Email não cadastrado")
    }
  }

  return (
    <SafeAreaView style={[globalStyles.pageContainer, { flex: 1, paddingBottom: 0 }]}>
      <View style={globalStyles.container}>
        <View style={{ flexDirection: "row" }}>
          {
            (showRegisterPassword || showInputPassword) &&
            <TouchableOpacity onPress={() => {
              setEmail('')
              setPassword('')
              setConfirmPassword('')
              setShowRegisterPassword(false)
              setShowInputPassword(false)
            }}>
              <Ionicons
                name="arrow-back-outline"
                size={35}
                color={colors.primary}
              />
            </TouchableOpacity>
          }
          <Text style={[globalStyles.title, { color: colors.primary }]}>
            Login
          </Text>
        </View>
        {erro && <Text style={{ color: colors.error }}>{erro}</Text>}

        <View style={globalStyles.formContainer}>
          {
            <Input
              label="Email"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              editable={!showRegisterPassword && !showInputPassword}
              inputStyle={{ flex: 1 }}
            />
          }
          {
            showRegisterPassword &&
            <>
              <Input
                label="Cadastre sua senha"
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                textContentType="password"
                autoCapitalize="none"
                onSubmitEditing={login}
                inputStyle={{ flex: 1 }}
              />
              <Input
                label="Confirme sua senha"
                placeholder="Senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                textContentType="password"
                autoCapitalize="none"
                onSubmitEditing={login}
                inputStyle={{ flex: 1 }}
              />
            </>
          }
          {
            showInputPassword &&
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
          }
        </View>
        <Button
          title={"Entrar"}
          onPress={async () => {
            if (!showRegisterPassword && !showInputPassword) {
              getAcesss()
            }
            else if (showInputPassword) {
              login()
            }
            else {
              createPassword()
            }
          }}
        />
        <View style={styles.about}>
          <About/>
        </View>
      </View>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  about: {
    paddingTop: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  text: {
    color: colors.text,
    fontSize: 12,
    textAlign: "center",
  }
});