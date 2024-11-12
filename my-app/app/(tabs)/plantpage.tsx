import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';

// Obtiene el ancho de la pantalla para hacer el ajuste
const screenWidth = Dimensions.get('window').width;

// Determina si es un dispositivo de pantalla ancha (tablet o computadora)
const isWideScreen = screenWidth > 800;

const PlantsScreen: React.FC = () => {
  // Lista de plantas
  const plants = ['Plant 1', 'Plant 2', 'Plant 3', 'Plant 4'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Título principal */}
      <Text style={styles.title}>Plants</Text>
      
      {/* Subtítulo */}
      <Text style={styles.subtitle}>Choose a plant</Text>

      {/* Tarjetas de plantas con imagen de fondo */}
      <View style={styles.plantsContainer}>
        {plants.map((plant, index) => (
          <TouchableOpacity key={index} style={isWideScreen ? styles.plantCardWide : styles.plantCard}>
            <ImageBackground
              source={require('../../assets/images/template_plantselect.webp')} // Asegúrate de ajustar la ruta a tu imagen
              style={styles.imageBackground}
              imageStyle={{ borderRadius: 8 }}
            >
              <Text style={styles.plantText}>{plant}</Text>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    paddingVertical: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    color: '#78B494',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F5A32',
    marginVertical: 20,
  },
  plantsContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: isWideScreen ? 'flex-start' : 'center',
    flexDirection: isWideScreen ? 'row' : 'column',
    flexWrap: isWideScreen ? 'wrap' : 'nowrap',
    paddingHorizontal: isWideScreen ? 20 : 0,
  },
  plantCard: {
    width: '90%',
    height: 100,
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  plantCardWide: {
    width: '20%',  // Ajusta el tamaño para que sean cuadrados y se adapten mejor en pantallas amplias
    aspectRatio: 1,
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
});

export default PlantsScreen;
