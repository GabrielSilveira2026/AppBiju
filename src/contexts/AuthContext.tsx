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
    const response = await axios.get(`https://g4673849dbf8477-rp6p6ma0c5ogvr7w.adb.sa-saopaulo-1.oraclecloudapps.com/ords/admin/login/teste@123?senha=teste@123`)
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
    setUser(null)
    setIsAuthenticated(false)
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

