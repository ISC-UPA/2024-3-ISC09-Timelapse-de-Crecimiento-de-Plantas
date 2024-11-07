import { useState } from 'react';
import { TextInput, Button, Text, View, Image, ScrollView, useColorScheme } from 'react-native';
import { HelloWave } from '@/components/HelloWave'; // Importar el componente HelloWave
import { styles } from '../styles/loginpage'; // Importar los estilos

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Detectar el esquema de color (light o dark)
  const colorScheme = useColorScheme();

  const handleLogin = () => {
    // Lógica de autenticación
    console.log('Email:', email, 'Password:', password);
  };

  // Definir colores según el esquema
  const backgroundColor = colorScheme === 'dark' ? '#1c1c1c' : '#F5F5F5';
  const textColor = colorScheme === 'dark' ? '#fff' : '#000';
  const inputBackgroundColor = colorScheme === 'dark' ? '#333' : '#fff';
  const inputBorderColor = colorScheme === 'dark' ? '#444' : '#ccc';
  const buttonColor = colorScheme === 'dark' ? '#0066CC' : '#0066CC'; // Puedes cambiarlo si quieres algo diferente

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <Image
        source={require('@/assets/images/logo-loginpage.png')}
        style={styles.reactLogo}
      />
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: textColor }]}>Login</Text>
        <View style={styles.welcomeBackContainer}>
          {/* El componente HelloWave a la izquierda del emoji */}
          <HelloWave/>
          {/* El emoji 👋 y el texto "Welcome back!" */}
          <Text style={[styles.subtitle, { color: textColor }]}> Welcome back!</Text>
        </View>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={[styles.subtitle, { color: textColor }]}>Enter your details</Text>
        
        <TextInput
          style={[styles.input, { backgroundColor: inputBackgroundColor, borderColor: inputBorderColor }]}
          placeholder="Email"
          placeholderTextColor={colorScheme === 'dark' ? '#bbb' : '#666'}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        
        <TextInput
          style={[styles.input, { backgroundColor: inputBackgroundColor, borderColor: inputBorderColor }]}
          placeholder="Password"
          placeholderTextColor={colorScheme === 'dark' ? '#bbb' : '#666'}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        
        <Button title="Login" onPress={handleLogin} color={buttonColor} />
      </View>
      
      <View style={styles.footerContainer}>
        <Text style={{ color: textColor }}>
          Don't have an account? <Text style={styles.signUpText}>Sign Up</Text>
        </Text>
      </View>
    </ScrollView>
  );
}
