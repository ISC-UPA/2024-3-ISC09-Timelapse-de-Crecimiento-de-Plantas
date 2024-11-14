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

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get('window'); // Obtiene las dimensiones de la pantalla

export default function App() {
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

  const handleSignIn = () => {
    promptAsync().then((codeResponse) => {
      if (request && codeResponse?.type === 'success' && discovery) {
        exchangeCodeAsync(
          {
            clientId,
            code: codeResponse.params.code,
            extraParams: request.codeVerifier ? { code_verifier: request.codeVerifier } : undefined,
            redirectUri,
          },
          discovery
        ).then(async (res) => {
          setToken(res.accessToken);
          try {
            await AsyncStorage.setItem('accessToken', res.accessToken);
            await AsyncStorage.setItem('refreshToken', res.refreshToken ?? '');
            await AsyncStorage.setItem('expiresIn', res.expiresIn?.toString() || '');
            await AsyncStorage.setItem('issuedAt', res.issuedAt.toString());
            console.log('Access token guardado correctamente');
          } catch (error) {
            console.error('Error al guardar access token en AsyncStorage', error);
          }
        });
      }
    });
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('expiresIn');
      await AsyncStorage.removeItem('issuedAt');
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
          {/* Sección izquierda con el mensaje de bienvenida */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome to...</Text>
            <Text style={styles.welcomeText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Text>
          </View>

          {/* Sección derecha con el logo, botón de inicio de sesión y mensaje */}
          <View style={styles.loginSection}>
            <Image
              source={require('../assets/images/PlantLogo.jpeg')}
              style={[styles.logo, Platform.OS === 'web' ? { width: 150, height: 150 } : { width: width * 0.4, height: width * 0.4 }]} // Ajusta el tamaño del logo en web y móvil
            />
            <TouchableOpacity style={styles.microsoftButton} onPress={token ? handleSignOut : handleSignIn}>
              <View style={styles.buttonContent}>
                <Image
                  source={require('../assets/images/microsoft.png')}
                  style={[styles.buttonImage, { width: 24, height: 24 }]} // Ajusta el tamaño de la imagen del botón
                />
                <Text style={[styles.buttonText, Platform.OS === 'web' ? { fontSize: 14 } : { fontSize: 12 }]}>
                  {token ? 'Cerrar sesión' : 'Iniciar sesión con Azure'}
                </Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.loginMessage}>
              {token ? 'Sesión iniciada' : 'Por favor, inicia sesión'}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
