import { colors, typography } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';

function TabBarIcon({ name, focused }: { name: keyof typeof Ionicons.glyphMap; focused: boolean }) {
  return (
    <Ionicons
      name={name}
      size={22}
      color={focused ? colors.primary : colors.borderLight}
      accessibilityRole="image"
      accessibilityLabel={name}
      style={{ marginBottom: -3 }}
    />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="motos"
      screenOptions={{
        headerShown: false,
        headerTitleAlign: 'center',
        tabBarLabelStyle: {
          fontSize: typography.fontSize.sm,
          fontFamily: typography.fontFamily.arimo,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.backgroundDisabled,
        tabBarStyle: {
          backgroundColor: colors.border,
          borderTopColor: colors.border,
          height: 100,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="motos"
        options={{
          title: 'Motos',
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require('@/assets/images/ic-tab-motosor-red.png')
                  : require('@/assets/images/ic--round-motorcycle-withe.png')
              }
              style={{ width: 32, height: 32 }}
              accessibilityRole="image"
              accessibilityLabel="motos"
            />
          ),
          tabBarAccessibilityLabel: 'Aba Motos',
        }}
      />
      <Tabs.Screen
        name="oficinas"
        options={{
          title: 'Oficinas',
          tabBarIcon: ({ focused }) => <TabBarIcon name="location" focused={focused} />,
          tabBarAccessibilityLabel: 'Aba Oficinas',
        }}
      />
      <Tabs.Screen
        name="notificacoes"
        options={{
          title: 'Notificações',
          tabBarIcon: ({ focused }) => <TabBarIcon name="notifications" focused={focused} />,
          tabBarAccessibilityLabel: 'Aba Notificações',
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => <TabBarIcon name="person" focused={focused} />,
          tabBarAccessibilityLabel: 'Aba Perfil',
        }}
      />
    </Tabs>
  );
}


