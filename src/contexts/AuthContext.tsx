import React, { createContext, Dispatch, SetStateAction, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../httpservices/pessoaApi';
import { PessoaType } from '../types/types';

type AuthContextType = {
  isAuthenticated: boolean;
  user: PessoaType | null;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  signIn: (email: string, senha: string) => Promise<any>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<PessoaType | null>(null)

  useEffect(() => {
    async function validaUsuario() {
      try {
        const dataUsuario = await AsyncStorage.getItem('@usuario');
        if (dataUsuario) {
          const { usuario } = JSON.parse(dataUsuario);
          console.log(usuario);

          setUser(usuario);
          setIsAuthenticated(true);
          // setTimeout(() => 
            router.navigate('/(tabs)/produtos')
          // , 1000)
        }
        else {
          // setTimeout(() => 
            router.navigate('/login')
          // , 1500)
        }
      } catch (error) {
        console.log('Erro ao recuperar o usuário:', error);
      }
    }

    validaUsuario();
  }, []);

  async function signIn(email: string, senha: string) {
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
        // if (userData.id_perfil === 1) {
        //   router.navigate("/(tabs)/produtos")
        // }
        // else if(userData.id_perfil === 1){
        //   console.log("Admin");
        // }

        router.navigate("/(tabs)/produtos")

      } catch (error) {
        console.log(error);
      }
    }
    else {
      return { status: 401 }
    }
  }

  async function signOut() {
    try {
      setIsAuthenticated(false)
      setUser(null)
      await AsyncStorage.removeItem("@usuario")
      router.navigate('/login')
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, signIn, signOut, user }}>
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

