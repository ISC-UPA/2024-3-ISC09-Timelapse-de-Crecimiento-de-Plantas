import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session';
import { Text, SafeAreaView, useColorScheme, TouchableOpacity, Image, View, Platform, Dimensions } from 'react-native';
import createStyles from './styles/loginpage'; // Importa los estilos dinámicos
import { useRouter } from 'expo-router'; // Importa useRouter
import { useLazyQuery } from '@apollo/client';
import { GET_USER,User } from '@/api/queries/queryUser';

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get('window'); // Obtiene las dimensiones de la pantalla

export default function LoginPage() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme || 'light');
  const [email, setEmail] = useState<string | null>(null);
  const [getUser] = useLazyQuery(GET_USER, {
    onCompleted: (result:any) => {
     // console.log('Datos obtenidos:', result.guestUser);

      if (result?.guestUser) {
        console.log('Datos obtenidos:', result.guestUser.name);
        localStorage.setItem('device', result.guestUser. device.id);
        localStorage.setItem('username', result.guestUser. name);
        const iddevice = result.guestUser.device.id;
        router.push({
          pathname: '/(tabs)/plants/[id]',
          params: { id: iddevice },
        });
      }
    },
    onError: (error) => {
      console.error('Error al ejecutar la consulta:', error);
    },
  });

  const discovery = useAutoDiscovery(
    'https://login.microsoftonline.com/common/v2.0'
  );

  const tokenEndpoint = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
  const redirectUri = makeRedirectUri({ scheme: 'myapp', path: '' });
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


  const fetchUser = async (email: string) => {
    if (email) {
      console.log('Ejecutando consulta con email:', email);
      getUser({ variables: { where: { email } } });
    } else {
      router.replace('/access-denied');
    }
  };

  useEffect(() => {
    const loadToken = () => {
      const savedToken = localStorage.getItem('accessToken');
      if (savedToken) {
        setToken(savedToken);
      }
      setIsLoading(false);
    };
    loadToken();
  }, []);


  const decodeJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join('')
      );
      return JSON.parse(jsonPayload);
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
        const decoded = decodeJwt(res.idToken);
        if (decoded) {
          let email = decoded.email || '';
          const username = email.split('@')[0];

          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken ?? '');
          localStorage.setItem('expiresIn', res.expiresIn?.toString() || '');
          localStorage.setItem('issuedAt', res.issuedAt.toString());
          localStorage.setItem('email', email);
          localStorage.setItem('username', username);

          console.log('Datos del usuario guardados correctamente');
          getUser({ variables: { where: { email:email } } });
  
        } else {
          console.error('No se pudo decodificar el token');
        }
      } catch (error) {
        console.error('Error al guardar los datos del usuario', error);
      }
    }
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('expiresIn');
      localStorage.removeItem('issuedAt');
      localStorage.removeItem('email');
      localStorage.removeItem('username');
      setToken(null);
      console.log('Sesión cerrada y tokens eliminados');
    } catch (error) {
      console.error('Error al eliminar el token de localStorage', error);
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
