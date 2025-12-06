import { defaultScreenOptions } from '@/components/layout/defaultScreenOptions';
import { Stack } from 'expo-router';
import React from 'react';

export default function OficinasStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={defaultScreenOptions('Oficinas')} />
    </Stack>
  );
}
