import { Redirect, Stack } from "expo-router";

import { MotosProvider } from '@/contexts/motosContext';
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedLayout() {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return <Redirect href="/signIn" />
    }

    return (
        <MotosProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" options={{ title: "Home" }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </MotosProvider>
    )
}