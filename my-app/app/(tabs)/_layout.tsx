import React from 'react';
import { router, Tabs } from 'expo-router';
import { ApolloProvider } from '@apollo/client'; // Importa ApolloProvider
import client from '@/api/apolloClient'; // Ruta al cliente Apollo configurado
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/auth/authContext';
import { Ionicons } from '@expo/vector-icons'; 
import { useAuth } from '@/auth/authContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const {isAuthenticated, handleAuth, logout} = useAuth();
  const handleLogout = () => {
    logout()   
    router.push('/');
  };

  return (
    // Envolvemos las pestañas dentro de ApolloProvider
    <ApolloProvider client={client}>
      <AuthProvider>
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
      </Tabs>
      <View style={styles.navbar}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
            <Ionicons name="log-out-outline" size={24} color="black" style={styles.icon} />
          </TouchableOpacity>
        </View>
      
      </AuthProvider>
    </ApolloProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    position: 'static',
    top: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparente con fondo oscuro
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  logoutText: {
    color: 'black',
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
});
