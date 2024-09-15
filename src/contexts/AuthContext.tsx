import React, { createContext, Dispatch, SetStateAction, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../httpservices/pessoaApi';
import { PessoaType } from '../types/types';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: PessoaType | null;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  signIn: (email: string, senha: string) => Promise<any>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<PessoaType | null>(null)

  useEffect(() => {
    async function validaUsuario() {
      try {
        const dataUsuario = await AsyncStorage.getItem('@usuario');
        if (dataUsuario) {
          const { usuario } = JSON.parse(dataUsuario);
          setUser(usuario);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.warn('Erro ao recuperar o usuário:', error);
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 1000);
      }
    }

    validaUsuario();
  }, []);

  async function signIn(email: string, senha: string) {
    setIsLoading(true)
    const response = await login(email, senha)

    if (response.status === 571) {
      return response
    }

    if (response?.data?.items.length) {
      const userData: PessoaType = response.data.items[0]
      setUser(userData)
      setIsAuthenticated(true)
      try {
        await AsyncStorage.setItem("@usuario", JSON.stringify({ usuario: userData }))
        router.replace("/(tabs)/")

      } catch (error) {
        console.warn(error);
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 1000);
      }
    }
    else {
      return { status: 401 }
    }
  }

  async function signOut() {
    setIsLoading(true)
    try {
      setIsAuthenticated(false)
      setUser(null)
      await AsyncStorage.removeItem("@usuario")
      router.replace('/login');
    } catch (error) {
      console.warn(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 1000);
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, signIn, signOut, user, isLoading, setIsLoading }}>
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

