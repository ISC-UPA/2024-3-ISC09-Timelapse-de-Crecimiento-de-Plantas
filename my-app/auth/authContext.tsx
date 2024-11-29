import { router } from 'expo-router';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const AuthContext = createContext({
  isAuthenticated: false,
  login: (email: string, token: string) => {},
  logout: () => {},
  loading: true,
  handleAuth: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const handleAuth = ( ) => {  // Maneja la autenticación
   
    setIsAuthenticated(true);
  }

  useEffect(() => {
    const checkAuth = () => {
      console.log('AuthProvider checkAuth');
      const email = localStorage.getItem('email');
      const token = localStorage.getItem('accessToken');
      if (email && token) {
        console.log('AuthProvider checkAuth email:', email);
        console.log('AuthProvider checkAuth token:', token);
        setIsAuthenticated(true); // Actualiza el estado de autenticación
      }else{
        setIsAuthenticated(false); 
      }
 
      setLoading(false);
    
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#78B494" />
      </View>
    );
  }


  const login = (email:string, token:string) => {
    localStorage.setItem('email', email);
    localStorage.setItem('accessToken', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading,handleAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
const styles = StyleSheet.create({
  
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
   
});

export const useAuth = () => useContext(AuthContext);
