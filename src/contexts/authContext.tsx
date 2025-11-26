import { mockLogin, mockRegister } from "@/api/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"
import { createContext, PropsWithChildren, useEffect, useState } from "react"

export type User = {
    id: string
    name: string
    email: string
}

type AuthState = {
    user: User | null
    token: string | null
    isLoggedIn: boolean
    isReady: boolean
    signIn: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>
    signUp: (data: { name: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>
    signOut: () => void
}

const AUTH_STORAGE_KEY = "@revisaai-auth"

export const AuthContext = createContext<AuthState>({} as AuthState)

export function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isReady, setIsReady] = useState(false)

    /**
     * Salva o estado de autenticação no AsyncStorage
     */
    async function storageState(newState: { user: User | null; token: string | null; isLoggedIn: boolean }) {
        try {
            await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newState))
        } catch (error) {
            console.log("ERRO_SET_STORAGE_AUTH:", error)            
        }
    }

    /**
     * Função de login
     * Chama a API mockada e persiste os dados
     */
    async function signIn(credentials: { email: string; password: string }): Promise<{ success: boolean; error?: string }> {
        try {
            const response = await mockLogin(credentials.email, credentials.password)
            
            if (response.success) {
                setUser(response.user)
                setToken(response.token)
                setIsLoggedIn(true)
                
                await storageState({
                    user: response.user,
                    token: response.token,
                    isLoggedIn: true,
                })
                
                router.replace("/")
                return { success: true }
            } else {
                return { success: false, error: response.error }
            }
        } catch (error) {
            console.error("ERRO_SIGN_IN:", error)
            return { success: false, error: "Erro ao fazer login. Tente novamente." }
        }
    }

    /**
     * Função de cadastro
     * Chama a API mockada e faz login automático após cadastro
     */
    async function signUp(data: { name: string; email: string; password: string }): Promise<{ success: boolean; error?: string }> {
        try {
            const response = await mockRegister(data.name, data.email, data.password)
            
            if (response.success) {
                // Login automático após cadastro bem-sucedido
                setUser(response.user)
                setToken(response.token)
                setIsLoggedIn(true)
                
                await storageState({
                    user: response.user,
                    token: response.token,
                    isLoggedIn: true,
                })
                
                router.replace("/")
                return { success: true }
            } else {
                return { success: false, error: response.error }
            }
        } catch (error) {
            console.error("ERRO_SIGN_UP:", error)
            return { success: false, error: "Erro ao criar conta. Tente novamente." }
        }
    }

    /**
     * Função de logout
     * Limpa o estado e redireciona para login
     */
    function signOut() {
        setUser(null)
        setToken(null)
        setIsLoggedIn(false)
        storageState({ user: null, token: null, isLoggedIn: false })
        router.replace("/signIn")
    }

    /**
     * Carrega o estado de autenticação do AsyncStorage na inicialização
     */
    useEffect(() => {
        async function loadStoreState() {
            try {
                const storedState = await AsyncStorage.getItem(AUTH_STORAGE_KEY)
                const state = storedState ? JSON.parse(storedState!) : null
                
                if (state?.isLoggedIn && state?.user && state?.token) {
                    setUser(state.user)
                    setToken(state.token)
                    setIsLoggedIn(true)
                } else {
                    setIsLoggedIn(false)
                }
            } catch (error) {
                console.log("ERRO_LOAD_STORAGE_AUTH:", error)
                setIsLoggedIn(false)
            } finally {
                setIsReady(true)
            }
        }

        loadStoreState()
    }, [])

    return (
        <AuthContext.Provider value={{ user, token, isLoggedIn, isReady, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}