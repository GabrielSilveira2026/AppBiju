import React, { createContext, Dispatch, SetStateAction, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
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
  const [user, setUser] = useState<PessoaType | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  async function signIn(email: string, senha: string) {
    const response = await login(email, senha)

    if (response.status === 571) {
      return response
    }

    if (response?.data?.items.length) {
      setIsAuthenticated(true)
      setUser(response?.data?.items[0])
      router.navigate("/(tabs)/produtos")
    }
    else{
      return {status: 401}
    }
  }

  async function signOut() {
    setIsAuthenticated(false)
    setUser(null)
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

