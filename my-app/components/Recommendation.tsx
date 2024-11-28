import React from 'react';
import { ScrollView, Text, StyleSheet, useWindowDimensions } from 'react-native';

interface RecommendationsProps {
  planta: string; // Nombre de la planta
  message: string; // Mensaje de recomendación
  usuario: string; // Nombre del usuario
}

const Recommendations: React.FC<RecommendationsProps> = ({ planta, message, usuario }) => {
  const { width } = useWindowDimensions(); // Obtenemos las dimensiones de la ventana
  const isLargeScreen = width > 1024; // Consideramos pantallas grandes como aquellas con un ancho mayor a 1024px

  return (
    <ScrollView style={[styles.container, isLargeScreen && styles.largeContainer]}>
      <Text style={[styles.title, isLargeScreen && styles.largeTitle]}>
      Current recommendation
      </Text>
      <Text style={[styles.paragraph, isLargeScreen && styles.largeParagraph]}>
      Good day, {usuario}!
      </Text>
      <Text style={[styles.paragraph, isLargeScreen && styles.largeParagraph]}>
        {message}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 15,
    backgroundColor: '#A5D8B4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: 10,
    width: '90%',
  },
  largeContainer: {
    width: '95%',
},
  title: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: 10,
  },
  largeTitle: {
    fontSize: 20, // Aumenta el tamaño de la fuente en pantallas grandes
  },
  paragraph: {
    // fontWeight: 500,
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  largeParagraph: {
    fontSize: 16, // Aumenta el tamaño de la fuente en pantallas grandes
  },
});

export default Recommendations;
