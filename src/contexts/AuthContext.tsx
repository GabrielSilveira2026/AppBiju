import React, { createContext, Dispatch, SetStateAction, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPeople, login } from '../httpservices/user';
import { UserType } from '../types/types';

type AuthContextType = {
  isAuthenticated: () => Promise<true | false>;
  user: UserType | null;
  signIn: (email: string, senha: string) => Promise<any>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null)

  async function isAuthenticated() {
    try {
      const userDataLocal = await AsyncStorage.getItem('@user');
      if (userDataLocal) {
        const userDataLocalJson = JSON.parse(userDataLocal);
        const response = await getPeople(userDataLocalJson.user.id_pessoa)

        if (response.status === 571) {
          console.warn('Erro ao recuperar o usuário nos base remota');
        }

        if (response?.data?.items?.length) {
          const userDataRemote = response.data.items[0]
          setUser(userDataRemote);
        } else {
          setUser(userDataLocalJson.user);
        }
        return true
      }
      else {
        return false
      }
    } catch (error) {
      console.warn('Erro ao recuperar o usuário:', error);
      return false
    }
  }

  async function signIn(email: string, senha: string) {
    const response = await login(email, senha)

    if (response.status === 571) {
      return response
    }

    if (response?.data?.items?.length) {
      const userData: UserType = response.data.items[0]
      setUser(userData)
      try {
        await AsyncStorage.setItem("@user", JSON.stringify({ user: userData }))
        return { status: 200 }
      } catch (error) {
        return { status: 500 }
      }
    }
    else {
      return { status: 401 }
    }
  }

  async function signOut() {
    try {
      setUser(null)
      await AsyncStorage.removeItem("@user")
    } catch (error) {
      console.warn(error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, user, isAuthenticated }}>
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

