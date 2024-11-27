import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const AccessDeniedScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acceso Denegado</Text>
      <Text style={styles.message}>
        No tienes permiso para acceder a esta sección de la aplicación.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/')} // Regresar a la pantalla principal o de login
      >
        <Text style={styles.buttonText}>Volver al Inicio</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d9534f',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#5a5a5a',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0275d8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AccessDeniedScreen;
