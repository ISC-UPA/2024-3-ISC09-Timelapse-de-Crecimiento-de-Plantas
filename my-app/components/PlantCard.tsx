import React from 'react';
import { Text, TouchableOpacity, ImageBackground, StyleSheet, useWindowDimensions } from 'react-native';

interface Plant {
  id: string;
  name: string;
  description?: string;
}

interface PlantCardProps {
  plant: Plant; // Cambiado para aceptar una planta
  isWideScreen: boolean;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, isWideScreen }) => {
  const { width } = useWindowDimensions();
  const cardWidth = isWideScreen ? 350 : width * 0.9;

  return (
    <TouchableOpacity style={[styles.plantCard, { width: cardWidth }]}>
      <ImageBackground
        source={require('../assets/images/template_plantselect.webp')}
        style={styles.imageBackground}
        imageStyle={{ borderRadius: 12 }}>
        <Text style={styles.plantText}>{plant.name}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  plantCard: {
    alignSelf: 'center',
    margin: 10,
    width: '90%',
    height: 200,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  imageBackground: {
    flex: 1,
    width: 'auto',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantText: {
    fontSize: 25,
    color: '#FFFFFF',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
});

export default PlantCard;
