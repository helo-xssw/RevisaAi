// src/app/(protected)/(tabs)/motos/_layout.tsx
import { defaultScreenOptions } from '@/components/layout/defaultScreenOptions';
import { Stack } from 'expo-router';
import React from 'react';

export default function MotosStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={defaultScreenOptions('Minhas Motos')} />
      <Stack.Screen name="add" options={defaultScreenOptions('Adicionar Moto')} />
      <Stack.Screen name="revisions" options={defaultScreenOptions('Minhas Revisões')} />
      <Stack.Screen
        name="revision-form"
        options={defaultScreenOptions('Adicionar Revisão')}
      />
    </Stack>
  );
}
