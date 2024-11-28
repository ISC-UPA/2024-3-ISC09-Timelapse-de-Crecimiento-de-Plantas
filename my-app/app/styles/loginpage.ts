import { StyleSheet } from 'react-native';

export default (colorScheme: 'light' | 'dark') => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorScheme === 'light' ? '#F1F1F1' : '#1E1E1E',
  },
  loginContainer: {
    flex: 1,
  },
  welcomeSection: {
    // flex: 1,
    
    backgroundColor: colorScheme === 'light' ? '#28784D' : '#333333',
    justifyContent: 'center',
    padding: 30,
  },
  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  welcomeText: {
    color: '#D0FDD7',
    fontSize: 16,
    lineHeight: 24,
  },
  loginSection: {
    flex: 1,
    backgroundColor: colorScheme === 'light' ? '#FFFFFF' : '#2A2A2A',
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
    backgroundColor: colorScheme  === 'light' ? '#78B494' : '#4B966E',    paddingVertical: 12,
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginMessage: {
    marginTop: 20,
    fontSize: 16,
    color: colorScheme === 'light' ? '#2A8C4A' : '#A1C9A1',
  },
  iconButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    backgroundColor: colorScheme  === 'light' ? '#78B494' : '#4B966E',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
});