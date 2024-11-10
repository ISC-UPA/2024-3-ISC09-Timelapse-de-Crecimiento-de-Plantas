// styles.ts
import { StyleSheet } from 'react-native';

const createStyles = (theme: string) => {
  return StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      backgroundColor: theme === 'dark' ? '#121212' : '#ffffff', // Cambiar fondo según el tema
    },
    text: {
      color: theme === 'dark' ? '#ffffff' : '#000000', // Cambiar texto según el tema
      margin: 10,
      fontSize: 16,
    },
    button: {
      backgroundColor: '#0078D4', // Azul para el botón
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      marginBottom: 20,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonImage: {
      width: 24,
      height: 24,
      marginRight: 10, // Espacio entre la imagen y el texto
    },
    buttonText: {
      color: '#ffffff', // Color del texto del botón
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
};

export default createStyles;
