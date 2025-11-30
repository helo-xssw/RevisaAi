import { Redirect, Stack } from "expo-router";

import { useAuth } from "@/hooks/useAuth";

export default function ProtectedLayout() {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return <Redirect href="/signIn" />
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: "Home" }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    )
}