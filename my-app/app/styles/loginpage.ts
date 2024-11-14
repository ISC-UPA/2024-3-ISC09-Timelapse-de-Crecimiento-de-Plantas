import { StyleSheet } from 'react-native';

export default (colorScheme: 'light' | 'dark') => StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colorScheme === 'light' ? '#D0FDD7' : '#1E1E1E', // Fondo general
  },
  loginContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  welcomeSection: {
    flex: 1,
    backgroundColor: colorScheme === 'light' ? '#2A8C4A' : '#333333', // Fondo de bienvenida
    justifyContent: 'center',
    padding: 30,
  },
  welcomeTitle: {
    color: colorScheme === 'light' ? '#FFFFFF' : '#F1F1F1', // Título en blanco o gris claro
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  welcomeText: {
    color: colorScheme === 'light' ? '#D0FDD7' : '#B0B0B0', // Texto en color claro o gris
    fontSize: 16,
    lineHeight: 24,
  },
  loginSection: {
    flex: 1,
    backgroundColor: colorScheme === 'light' ? '#FFFFFF' : '#2A2A2A', // Fondo de la sección de inicio de sesión
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  microsoftButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorScheme === 'light' ? '#64C27B' : '#3D7F4C', // Color del botón
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    width: '100%',
    maxWidth: 250,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonImage: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    color: '#FFFFFF', // Texto del botón en blanco para contraste
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginMessage: {
    marginTop: 20,
    fontSize: 16,
    color: colorScheme === 'light' ? '#2A8C4A' : '#A1C9A1', // Mensaje de login en verde oscuro o más claro en modo oscuro
  },
});
