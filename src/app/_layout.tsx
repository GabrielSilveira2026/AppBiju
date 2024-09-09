import { Slot, Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark"/>
      <Slot/>
    </AuthProvider>
  );
}
