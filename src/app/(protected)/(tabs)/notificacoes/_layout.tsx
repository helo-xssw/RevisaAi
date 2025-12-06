// src/app/(protected)/(tabs)/notificacoes/_layout.tsx
import { defaultScreenOptions } from '@/components/layout/defaultScreenOptions';
import { Stack } from 'expo-router';
import React from 'react';

export default function NotificacoesStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={defaultScreenOptions('Notificações')}
      />
    </Stack>
  );
}
