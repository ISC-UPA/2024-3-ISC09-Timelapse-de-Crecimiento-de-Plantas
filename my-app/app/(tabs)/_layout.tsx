import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Asegúrate de que la ruta de la pantalla de Login esté configurada correctamente
// Puedes crear un archivo de navegación separado para 'LoginPage' si es necesario
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
<<<<<<< HEAD
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'dashboard',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
=======
      {/* Pantalla de Login (sin usar 'component') */}
      <Tabs.Screen
        name="loginpage" // Nombre para acceder a la pantalla de login
        options={{
          title: 'Loginpage',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'log-in' : 'log-in-outline'} color={color} />
>>>>>>> LoginPage
          ),
        }}
      />
    </Tabs>
  );
}
