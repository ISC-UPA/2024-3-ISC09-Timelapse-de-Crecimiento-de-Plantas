import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session';
import { Button, Text, SafeAreaView, Platform, TouchableOpacity, Image, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useThemeStyles from '../styles/loginpage'; // Importa los estilos dinámicos

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const styles = useThemeStyles();
  const discovery = useAutoDiscovery(
    'https://login.microsoftonline.com/2803e296-cffb-471f-a4b5-988a45052db6/v2.0'
  );

  const redirectUri = makeRedirectUri({
    scheme: 'myapp',
    path: Platform.select({
      ios: '',
      android: '',
      default: '',
    }),
  });

  const clientId = 'b6003d17-274d-46dd-87fc-ee9633ef41b0';

  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        <>
          <TouchableOpacity
            style={styles.button}
            disabled={!request && !discovery}
            onPress={token ? handleSignOut : handleSignIn}
          >
            <View style={styles.buttonContent}>
              <Image
                source={require('../../assets/images/microsoft-logo.png')} // Ruta al ícono de Microsoft
                style={styles.icon}
              />
              <Text style={styles.buttonText}>
                {token ? 'Cerrar sesión' : 'Iniciar sesión con Azure'}
              </Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.text}>{token ? 'Sesión iniciada' : 'Por favor, inicia sesión'}</Text>
        </>
      )}
    </SafeAreaView>
  );
}
