import { StyleSheet, useColorScheme } from 'react-native';

export default function useThemeStyles() {
  const colorScheme = useColorScheme(); // Detecta el modo oscuro o claro

  const isDarkMode = colorScheme === 'dark';

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#000000' : '#ffffff', // Fondo según el modo
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: isDarkMode ? '#555555' : '#0078d4', // Fondo del botón según el modo
      borderRadius: 5,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      width: 24,
      height: 24,
      marginRight: 8, // Espacio entre el icono y el texto
    },
    buttonText: {
      color: isDarkMode ? '#ffffff' : '#ffffff', // Texto del botón según el modo
      fontSize: 16,
      fontWeight: 'bold',
    },
    text: {
      marginTop: 20,
      fontSize: 16,
      color: isDarkMode ? '#ffffff' : '#333333', // Texto según el modo
    },
  });
}
