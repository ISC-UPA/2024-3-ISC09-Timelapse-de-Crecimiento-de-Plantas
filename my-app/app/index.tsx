import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session';
import { Text, SafeAreaView, useColorScheme, TouchableOpacity, Image, View, Platform, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createStyles from './styles/loginpage'; // Importa los estilos dinámicos
import { useRouter } from 'expo-router'; // Importa useRouter

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get('window'); // Obtiene las dimensiones de la pantalla

export default function LoginPage() {
  const router = useRouter(); // Inicializa el hook de navegación
  const colorScheme = useColorScheme(); // Detecta el tema claro u oscuro
  const styles = createStyles(colorScheme || 'light'); // Aplica los estilos según el tema

  const discovery = useAutoDiscovery(
    'https://login.microsoftonline.com/2803e296-cffb-471f-a4b5-988a45052db6/v2.0'
  );
  const tokenEndpoint = 'https://login.microsoftonline.com/2803e296-cffb-471f-a4b5-988a45052db6/oauth2/v2.0/token';

  const redirectUri = makeRedirectUri({ scheme: 'myapp', path: '' });
  const clientId = 'b6003d17-274d-46dd-87fc-ee9633ef41b0';

  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Para indicar si estamos verificando el token al inicio

  const [request, , promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ['openid', 'profile', 'email', 'offline_access'],
      redirectUri,
      prompt: 'select_account',
    },
    discovery
  );

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem('accessToken');
      if (savedToken) {
        setToken(savedToken);
      }
      setIsLoading(false);
    };
    loadToken();
  }, []);

  const decodeJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1]; // Extrae la parte del payload
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Convierte a base64 estándar
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join('')
      );
      return JSON.parse(jsonPayload); // Devuelve el payload decodificado como objeto
    } catch (error) {
      console.error('Error al decodificar el token', error);
      return null;
    }
  };

  const handleSignIn = async () => {
    const codeResponse = await promptAsync();
    if (request && codeResponse?.type === 'success' && discovery) {
      const res = await exchangeCodeAsync(
        {
          clientId,
          code: codeResponse.params.code,
          extraParams: request.codeVerifier ? { code_verifier: request.codeVerifier } : undefined,
          redirectUri,
        },
        discovery
      );

      setToken(res.accessToken);

      try {
        // Decodificar el token para obtener la información del usuario
        const decoded = decodeJwt(res.idToken);
        if (decoded) {
          const email = decoded.email || '';
          const username = email.split('@')[0]; // Usa la parte local del correo como nombre de usuario

          // Guardar en AsyncStorage
          await AsyncStorage.multiSet([
            ['accessToken', res.accessToken],
            ['refreshToken', res.refreshToken ?? ''],
            ['expiresIn', res.expiresIn?.toString() || ''],
            ['issuedAt', res.issuedAt.toString()],
            ['email', email],
            ['username', username],
          ]);
          console.log('Datos del usuario guardados correctamente');

          // Redirigir al usuario a /dashboardpage
          const iddevice = 'cm3usu7ko00013v36s97yrq9n'; // ID fijo o dinámico según tu lógica
          router.push({
            pathname: '/(tabs)/plants/[id]',
            params: { id: iddevice }, // Pasa el parámetro iddevice como "id"
          });
        } else {
          console.error('No se pudo decodificar el token');
        }
      } catch (error) {
        console.error('Error al guardar los datos del usuario', error);
      }
    }

  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'expiresIn', 'issuedAt', 'email', 'username']);
      setToken(null);
      console.log('Sesión cerrada y tokens eliminados');
    } catch (error) {
      console.error('Error al eliminar el token de AsyncStorage', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <Text style={styles.text}>Cargando...</Text>
      ) : (
        <View style={styles.loginContainer}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome to...</Text>
            <Text style={styles.welcomeText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Text>
          </View>
          <View style={styles.loginSection}>
            <Image
              source={require('../assets/images/PlantLogo.jpeg')}
              style={[styles.logo, Platform.OS === 'web' ? { width: 150, height: 150 } : { width: width * 0.4, height: width * 0.4 }]} 
            />
            <TouchableOpacity style={styles.microsoftButton} onPress={token ? handleSignOut : handleSignIn}>
              <View style={styles.buttonContent}>
                <Image
                  source={require('../assets/images/microsoft.png')}
                  style={[styles.buttonImage, { width: 24, height: 24 }]} 
                />
                <Text style={[styles.buttonText, Platform.OS === 'web' ? { fontSize: 14 } : { fontSize: 12 }]}>{token ? 'Cerrar sesión' : 'Iniciar sesión con Azure'}</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.loginMessage}>{token ? 'Sesión iniciada' : 'Por favor, inicia sesión'}</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
