// PlantCard.tsx
import React from 'react';
import { Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';

interface PlantCardProps {
  plant: string;
  isWideScreen: boolean;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, isWideScreen }) => (
  <TouchableOpacity style={isWideScreen ? styles.plantCardWide : styles.plantCard}>
    <ImageBackground
      source={require('../assets/images/template_plantselect.webp')}
      style={styles.imageBackground}
      imageStyle={{ borderRadius: 8 }}
    >
      <Text style={styles.plantText}>{plant}</Text>
    </ImageBackground>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  plantCard: {
    width: '90%',
    height: 100,
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  plantCardWide: {
    width: '20%',
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

export default PlantCard;
