// src/app/(protected)/(tabs)/motos/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function MotosStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{ title: 'Minhas Motos', headerShown: false }}
      />
      <Stack.Screen
        name="add"
        options={{ title: 'Adicionar Moto', headerShown: true }}
      />
    </Stack>
  );
}
