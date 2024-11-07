import { useState } from 'react';
import { Text, View, Image, ScrollView, useColorScheme, TouchableOpacity } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import { styles } from '../styles/loginpage';
import Notification from '@/components/Notification';

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState(''); // Estado para el mensaje de error
  const [canShowError, setCanShowError] = useState(true); // Estado para controlar el cooldown

  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#1c1c1c' : '#F5F5F5';
  const textColor = colorScheme === 'dark' ? '#fff' : '#000';
  const buttonColor = colorScheme === 'dark' ? '#0066CC' : '#0066CC';

  const handleAzureLogin = () => {
    if (canShowError) {
      // Simulación de fallo en la autenticación
      const success = false; // Cambiar a true si la autenticación fuera exitosa

      if (!success) {
        setErrorMessage('Ocurrió un error inesperado');
        setCanShowError(false); // Desactivar la capacidad de mostrar errores
        setTimeout(() => {
          setCanShowError(true); // Rehabilitar después de 5 segundos
          setErrorMessage(''); // Limpiar el mensaje de error después del cooldown
        }, 5000); // 5000 ms = 5 segundos
      } else {
        setErrorMessage('');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <Image
        source={require('@/assets/images/logo-loginpage.png')}
        style={styles.reactLogo}
      />
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: textColor }]}>Login</Text>
        <View style={styles.welcomeBackContainer}>
          <HelloWave />
          <Text style={[styles.subtitle, { color: textColor }]}> Welcome back!</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonColor }]}
          onPress={handleAzureLogin}
        >
          <Text style={styles.buttonText}>Azure</Text>
        </TouchableOpacity>

        {/* Mostrar el mensaje de error si existe */}
        {errorMessage && (
          <Notification message={errorMessage} />
        )}
      </View>
    </ScrollView>
  );
}
