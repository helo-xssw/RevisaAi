import {
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  User,
  mockDeleteAccount,
  mockLogin,
  mockRegister,
  mockUpdateProfile,
} from '@/api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';

type AuthResult =
  | { success: true }
  | { success: false; error: string };

type AuthContextData = {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isReady: boolean;

  signIn: (payload: LoginPayload) => Promise<AuthResult>;
  signUp: (payload: RegisterPayload) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  updateProfile: (data: { name: string; email: string }) => Promise<void>;
  deleteAccount: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextData | undefined>(
  undefined,
);

type Props = { children: ReactNode };

const STORAGE_KEY = '@revisaai-auth';

type PersistedAuth = {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // -------- Persistência --------
  const saveAuth = useCallback(async (data: PersistedAuth) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar auth', error);
    }
  }, []);

  const clearAuth = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao remover auth', error);
    }
  }, []);

  // -------- Load inicial --------
  useEffect(() => {
    async function load() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: PersistedAuth = JSON.parse(stored);
          setUser(parsed.user);
          setToken(parsed.token);
          setIsLoggedIn(parsed.isLoggedIn);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsReady(true);
      }
    }
    load();
  }, []);

  // -------- Auth Actions --------

  async function signIn(payload: LoginPayload): Promise<AuthResult> {
    try {
      const { user, token } = await mockLogin(payload);
      setUser(user);
      setToken(token);
      setIsLoggedIn(true);
      await saveAuth({ user, token, isLoggedIn: true });
      router.replace('/');
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message ?? 'Erro ao fazer login',
      };
    }
  }

  async function signUp(payload: RegisterPayload): Promise<AuthResult> {
    try {
      const { user, token } = await mockRegister(payload);
      // login automático
      setUser(user);
      setToken(token);
      setIsLoggedIn(true);
      await saveAuth({ user, token, isLoggedIn: true });
      router.replace('/');
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message ?? 'Erro ao criar conta',
      };
    }
  }

  async function signOut() {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    await clearAuth();
    router.replace('/signIn');
  }

  async function updateProfile(data: { name: string; email: string }) {
    if (!user) throw new Error('Usuário não autenticado');

    const updated = await mockUpdateProfile({
      id: user.id,
      name: data.name,
      email: data.email,
    } as UpdateProfilePayload);

    setUser(updated);

    await saveAuth({
      user: updated,
      token,
      isLoggedIn: true,
    });
  }

  async function deleteAccount() {
    if (!user) throw new Error('Usuário não autenticado');

    await mockDeleteAccount(user.id);

    // logout completo
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    await clearAuth();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        isReady,
        signIn,
        signUp,
        signOut,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
