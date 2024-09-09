import React, { createContext, Dispatch, SetStateAction, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { router } from 'expo-router';

type AuthContextType = {
  isAuthenticated: boolean;
  user: UserType | null;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

type UserType = {
  email: string;
  id_perfil: number;
  id_pessoa: number;
  nome: string;
  perfil: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL  

  const [user, setUser] = useState<UserType | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('Usuário autenticado');
    } else {
      console.log('Usuário não autenticado');
    }
  }, [isAuthenticated]);

  async function signIn() {
    const response = await axios.get(`${baseUrl}/login/teste@123?senha=teste@123`)
    if (response.data.items.length) {
      setIsAuthenticated(true)
      setUser(response.data.items[0])
      console.log("user:", user);
      router.navigate("./(tabs)/produtos")
      return
    }
    setIsAuthenticated(false)
  }

  async function signOut() {
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, signIn, signOut, user}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useMyContext must be used within a MyProvider');
  }
  return context;
};

