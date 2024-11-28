import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session';
import { Text, SafeAreaView, TouchableOpacity, Image, View, Platform, Dimensions, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router'; // Importa useRouter
import Icon from 'react-native-vector-icons/FontAwesome'; // Para el ícono de modo oscuro/claro
import createStyles from './styles/loginpage'; // Importa los estilos dinámicos

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get('window'); // Obtiene las dimensiones de la pantalla

export default function LoginPage() {
  const router = useRouter(); // Inicializa el hook de navegación
  const [isDarkMode, setIsDarkMode] = useState(false); // Estado para alternar entre temas
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Para indicar si estamos verificando el token al inicio

  const styles = createStyles(isDarkMode ? 'dark' : 'light'); // Estilos dinámicos según el tema
  const { height, width } = useWindowDimensions(); // Detecta el ancho de la pantalla
  const isMobile = width < 768; // Define si es móvil o tablet

  const discovery = useAutoDiscovery(
    'https://login.microsoftonline.com/2803e296-cffb-471f-a4b5-988a45052db6/v2.0'
  );
  const tokenEndpoint = 'https://login.microsoftonline.com/2803e296-cffb-471f-a4b5-988a45052db6/oauth2/v2.0/token';
  const redirectUri = makeRedirectUri({ scheme: 'myapp', path: '' });
  const clientId = 'b6003d17-274d-46dd-87fc-ee9633ef41b0';

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
    const loadToken = () => {
      const savedToken = localStorage.getItem('accessToken');
      if (savedToken) {
        setToken(savedToken);
      }
      setIsLoading(false);
    };
    loadToken();
  }, []);

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
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken ?? '');
      localStorage.setItem('expiresIn', res.expiresIn?.toString() || '');
      localStorage.setItem('issuedAt', res.issuedAt.toString());

      router.push({
        pathname: '/(tabs)/plants/[id]',
        params: { id: 'cm3usu7ko00013v36s97yrq9n' },
      });
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('issuedAt');
    setToken(null);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode); // Alternar el modo
  };
  

  return (
  <SafeAreaView style={styles.container}>
  {isLoading ? (
    <Text style={styles.buttonText}>Cargando...</Text>
  ) : (
    <View
      style={[
        styles.loginContainer,
        { flexDirection: isMobile ? 'column' : 'row' }, // Cambia orientación según el dispositivo
      ]}
    >
      <View style={[
              styles.welcomeSection,
              { height: isMobile ? height * 0.4 : 'auto'},
              { width: isMobile ? 'auto' : width * 0.5} // Máximo 1/4 de pantalla en computadoras
            ]}>
        <Text style={[
              styles.welcomeTitle, {textAlign: isMobile ? 'center' : 'left'}
              ]} >Welcome to...</Text>
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
            <Text style={[styles.buttonText, Platform.OS === 'web' ? { fontSize: 14 } : { fontSize: 12 }]}>
              {token ? 'Log out' : 'Log in with Microsoft'}
            </Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.loginMessage}>{token ? 'Logged in' : 'Please login'}</Text>
      </View>
      <TouchableOpacity style={styles.iconButton} onPress={toggleTheme}>
            <Icon
              name={isDarkMode ? 'sun-o' : 'moon-o'}
              color={isDarkMode ? '#fff' : '#000'} // Color del ícono
              size={20}
            />
          </TouchableOpacity>
    </View>
  )}
</SafeAreaView>
);
}

  