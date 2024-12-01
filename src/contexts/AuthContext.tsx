import React, { createContext, Dispatch, SetStateAction, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPeople, login } from '../httpservices/user';
import { UserType } from '../types/types';
import { useSQLiteContext } from 'expo-sqlite';
import { constants } from '../constants/constants';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserType | null;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  signIn: (email: string, senha: string) => Promise<any>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    async function checkUser() {
      try {
        const userDataLocal = await AsyncStorage.getItem('@user');
        if (userDataLocal) {
          const userDataLocalJson = JSON.parse(userDataLocal);
          const response = await getPeople(userDataLocalJson.user.id_pessoa)

          if (response.status === 571) {
            console.warn('Erro ao recuperar o usuário nos base remota');
          }

          if (response?.data?.items.length) {
            const userDataRemote = response.data.items[0]
            setUser(userDataRemote);
            redirectUser(userDataRemote.id_perfil)
          }else{
            redirectUser(userDataLocalJson.id_perfil)
          }
          
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.warn('Erro ao recuperar o usuário:', error);
      } finally {
        setIsLoading(false)
      }
    }

    checkUser();
  }, []);

  function redirectUser(id_perfil: number) {
    if (id_perfil === constants.perfil.suporte.id_perfil) {
      router.replace("/(tabs)")
    } else if (id_perfil === constants.perfil.administrador.id_perfil) {
      router.replace("/(tabs)/employees")
    } else {
      router.replace({ pathname: "/", params: { id_pessoa: user?.id_pessoa }, })
    }
  }

  async function signIn(email: string, senha: string) {
    setIsLoading(true)
    const response = await login(email, senha)

    if (response.status === 571) {
      return response
    }

    if (response?.data?.items.length) {
      const userData: UserType = response.data.items[0]
      setUser(userData)
      setIsAuthenticated(true)
      try {
        await AsyncStorage.setItem("@user", JSON.stringify({ user: userData }))
        redirectUser(userData.id_perfil)
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
    router.replace('/login');

    setIsLoading(true)
    try {
      setIsAuthenticated(false)
      setUser(null)
      await AsyncStorage.removeItem("@user")
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

