import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importa el ícono
import Logo from '@/components/Logo'; // Ajusta la ruta si es diferente

const AccessDeniedScreen: React.FC = () => {
  const router = useRouter();
  const systemColorScheme = useColorScheme(); // Detectar el tema del sistema
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    // Actualizar el tema si el sistema cambia
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  // Alternar entre modos
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Estilos dinámicos según el tema
  const themeStyles = isDarkMode
    ? darkThemeStyles
    : lightThemeStyles;

  return (
    <View style={[commonStyles.container, themeStyles.container]}>
      <Logo left={700} top={150} width={150} height={150} />
      <Text style={[commonStyles.title, themeStyles.title]}>Access Denied</Text>
      <Text style={[commonStyles.message, themeStyles.message]}>
        You do not have permission to access this section of the application.
      </Text>
      <TouchableOpacity
        style={[commonStyles.button, themeStyles.button]}
        onPress={() => router.replace('/')}
      >
        <Text style={[commonStyles.buttonText, themeStyles.buttonText]}>Back to Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[commonStyles.iconButton, themeStyles.iconButton]}
        onPress={toggleTheme}
      >
        <Icon
          name={isDarkMode ? 'sun-o' : 'moon-o'} // Ícono de sol o luna según el modo
          size={20}
          color={isDarkMode ? '#fff' : '#000'} // Color del ícono
          style={commonStyles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconButton: {
    position: 'absolute',
    top: 0,
    left: 10,
    // flexDirection: 'row',
    // alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  icon: {
    
    marginRight: 0,
  },
});

const lightThemeStyles = StyleSheet.create({
  container: {
    backgroundColor: '#f1f1f1',
  },
  title: {
    color: '#000',
  },
  message: {
    color: '#5a5a5a',
  },
  button: {
    backgroundColor: '#78B494',
  },
  buttonText: {
    color: '#fff',
  },
  iconButton: {
    backgroundColor: '#78B494',
  },
});

const darkThemeStyles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
  },
  title: {
    color: '#ffffff',
  },
  message: {
    color: '#d1d1d1',
  },
  button: {
    backgroundColor: '#4B966E',
  },
  buttonText: {
    color: '#ffffff',
  },
  iconButton: {
    backgroundColor: '#4B966E',
  },
});

export default AccessDeniedScreen;
