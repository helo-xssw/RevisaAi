import { defaultScreenOptions } from '@/components/layout/defaultScreenOptions';
import { Stack } from 'expo-router';
import React from 'react';

export default function PerfilStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={defaultScreenOptions('Perfil e Configurações')} />
      <Stack.Screen name="edit" options={defaultScreenOptions('Editar Perfil')} />
      <Stack.Screen name="notifications" options={defaultScreenOptions('Gerenciar Notificações')} />
    </Stack>
  );
}
