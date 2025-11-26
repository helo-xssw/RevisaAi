import { AuthProvider } from "@/contexts/authContext";
import { Stack } from "expo-router";

export default function Layout() {
    return (
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false, animation: "none" }}>
                <Stack.Screen 
                    name="splash" 
                    options={{ 
                        headerShown: false, 
                        animation: "fade"
                    }} 
                />
                <Stack.Screen 
                    name="(protected)" 
                    options={{ 
                        headerShown: false
                    }} 
                />
                <Stack.Screen 
                    name="signIn" 
                    options={{ 
                        title: "Entrar", 
                        headerShown: false
                    }} 
                />
                <Stack.Screen 
                    name="signUp" 
                    options={{ 
                        title: "Criar Conta", 
                        headerShown: false
                    }} 
                />
            </Stack>
        </AuthProvider>
    )
}