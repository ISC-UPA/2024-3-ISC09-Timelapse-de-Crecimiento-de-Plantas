import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Logo = (  { width = 150, height = 150 }) => {
  return (
    <View style={[styles.container,]}>
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
    position: 'static',
  },
});

export default Logo;
