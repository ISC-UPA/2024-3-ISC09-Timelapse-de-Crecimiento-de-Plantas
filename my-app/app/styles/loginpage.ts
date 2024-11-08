// LoginPage.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center', // Centra todo el contenido
  },
  reactLogo: {
    height: 100,
    width: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  welcomeBackContainer: {
    flexDirection: 'row', // Usamos row para poner el HelloWave y el texto en línea
    alignItems: 'center', // Alineamos en el centro verticalmente
    marginTop: 10,
  },
  helloWave: {
    marginRight: 10, // Espaciado entre la mano y el texto
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
  },
  formContainer: {
    gap: 16,
    marginBottom: 20,
    width: '100%', // Asegura que ocupe el 100% del contenedor
    maxWidth: 400, // Límite máximo de ancho para el formulario
    padding: 20, // Relleno adicional para los campos
    alignItems: 'center', // Centra el formulario
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    width: '100%', // Hace que el input ocupe el 100% del contenedor
    backgroundColor: '#fff',
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  signUpText: {
    fontWeight: 'bold',
    color: '#0066CC',
  },

  // Estilos para el botón personalizado
  button: {
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // Asegura que el botón ocupe el 100% del contenedor
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },

  // Estilos específicos para web
  webInput: {
    fontSize: 12, // Reduce el tamaño del texto en la versión web
    height: 40, // Reduce la altura en la versión web
  },
});
