import React from 'react';
import { Tabs } from 'expo-router';
import { ApolloProvider } from '@apollo/client'; // Importa ApolloProvider
import client from '@/api/apolloClient'; // Ruta al cliente Apollo configurado
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    // Envolvemos las pestañas dentro de ApolloProvider
    <ApolloProvider client={client}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Aquí ocultamos la barra de navegación inferior

        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'code-slash' : 'code-slash-outline'}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="plants/dashboard"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'code-slash' : 'code-slash-outline'}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="loginpage"
          options={{
            title: 'Loginpage',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'log-in' : 'log-in-outline'}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </ApolloProvider>
  );
}
