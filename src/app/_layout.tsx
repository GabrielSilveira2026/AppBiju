import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext"; // Certifique-se de que o caminho está correto

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false}} />
      </Stack>
    </AuthProvider>
  );
}
