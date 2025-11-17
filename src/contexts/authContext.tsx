import AsyncStorage from "@react-native-async-storage/async-storage"
import { router } from "expo-router"
import { createContext, PropsWithChildren, useEffect, useState } from "react"


type AuthState = {
    isLoggedIn: boolean
    isReady: boolean
    signIn: () => void
    signOut: () => void
}

const AUTH_STORAGE_KEY = "@revisaai:auth"

export const AuthContext = createContext<AuthState>({} as AuthState)

export function AuthProvider({ children }: PropsWithChildren) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isReady, setIsReady] = useState(false)


     async function storageState(newState: { isLoggedIn: boolean }) {
        try {
            await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newState))
        } catch (error) {
            console.log("ERRO_SET_STORAGE_AUTH:", error)            
        }
    }

    function signIn() {
        setIsLoggedIn(true)
        storageState({ isLoggedIn: true })
        router.replace("/")
    }

    function signOut() {
        setIsLoggedIn(false)
        storageState({ isLoggedIn: false })
        router.replace("/signIn")
    }

    useEffect(() => {
        async function loadStoreState() {
            try {
                const storedState = await AsyncStorage.getItem(AUTH_STORAGE_KEY)
                const state = storedState ? JSON.parse(storedState!) : null
                console.log("EStado", state)
                
                setIsLoggedIn(state?.isLoggedIn ?? false)

            } catch (error) {
                console.log("ERRO_LOAD_STORAGE_AUTH:", error)
                setIsReady(false)
            } finally {
                setIsReady(true)
            }
        }

        loadStoreState()
    }, [])

    return (
        <AuthContext.Provider value={{ isLoggedIn, isReady, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}