import { Stack } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';

export default function PerfilStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Perfil e Configurações',
          headerTitleAlign: 'left',
          headerRight: () => (
            <Image
              source={require('@/assets/images/moto_logo_1.png')}
              style={{ width: 64, height: 64, resizeMode: 'contain', marginRight: 8 }}
              accessibilityLabel="Logo moto"
            />
          ),
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: 'Editar Perfil',
          headerTitleAlign: 'left',
          headerRight: () => (
            <Image
              source={require('@/assets/images/moto_logo_1.png')}
              style={{ width: 64, height: 64, resizeMode: 'contain', marginRight: 8 }}
              accessibilityLabel="Logo moto"
            />
          ),
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: 'Gerenciar Notificações',
          headerTitleAlign: 'left',
          headerRight: () => (
            <Image
              source={require('@/assets/images/moto_logo_1.png')}
              style={{ width: 64, height: 64, resizeMode: 'contain', marginRight: 8 }}
              accessibilityLabel="Logo moto"
            />
          ),
        }}
      />
    </Stack>
  );
}
