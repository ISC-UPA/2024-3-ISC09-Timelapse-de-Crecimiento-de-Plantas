// LoginPage.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
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
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  signUpText: {
    fontWeight: 'bold',
    color: '#0066CC',
  },
});
