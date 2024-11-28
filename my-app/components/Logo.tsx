import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Logo = ({ left = 0, top = 0, width = 150, height = 150 }) => {
  return (
    <View style={[styles.container, { left, top }]}>
      <Image 
        source={require('../assets/images/plantlogo.png')} // Cambia la ruta según tu proyecto
        style={{ width, height }} 
        resizeMode="contain" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute', // Necesario para aplicar las props de posicionamiento
  },
});

export default Logo;
