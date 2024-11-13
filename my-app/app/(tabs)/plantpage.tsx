// PlantsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import PlantCard from '../../components/PlantCard';

// Obtiene el ancho de la pantalla para hacer el ajuste
const screenWidth = Dimensions.get('window').width;
const isWideScreen = screenWidth > 800;

const PlantsScreen: React.FC = () => {
  const plants = ['Plant 1', 'Plant 2', 'Plant 3', 'Plant 4'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Plants</Text>
      <Text style={styles.subtitle}>Choose a plant</Text>

      <View style={styles.plantsContainer}>
        {plants.map((plant, index) => (
          <PlantCard key={index} plant={plant} isWideScreen={isWideScreen} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    flexGrow: 1,
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
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
});

export default PlantsScreen;
