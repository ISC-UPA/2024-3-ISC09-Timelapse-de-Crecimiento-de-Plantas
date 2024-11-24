import React from 'react';
import { useQuery } from '@apollo/client';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  useWindowDimensions, 
} from 'react-native';
import PlantCard from '@/components/PlantCard';
import { GET_PLANTS ,Plant } from '@/api/queries/queryPlants';

// Define la interfaz para el tipo de plant

const PlantPage: React.FC = () => {

  const { width } = useWindowDimensions();
  const isWideScreen = width > 1024; // Determina si está en pantalla grande

  const { data, loading, error } = useQuery(GET_PLANTS, {
    variables: {
      where: {
        device: {
          id: {
            equals: 'cm3usu7ko00013v36s97yrq9n',//Id del dispositivo al que esta asignada las plantas que regresara la pericion 
          },
        },
      },
    },
  });

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#78B494" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error al cargar las plantas.</Text>
      </View>
    );
  }

  const plants: Plant[] = data?.plants || [];

  return (
    <ScrollView contentContainerStyle={[styles.container, isWideScreen && styles.largeContainer]}>
        <Text style={styles.title}>Plants</Text>
        <Text style={styles.subtitle}>Choose a plant</Text>
     {
        ///recorre el array de plants tipando cada elemento con la interface platas declarada arriba
     } 
      
      {/* <View style={[styles.plantsContainer, isWideScreen && styles.plantsRow]}>
        {plants.map((plant: Plant) => ( 
          <View key={plant.id} style={styles.plantCard}>
            <Text style={styles.plantName}>{plant.name}</Text>
            {plant.description && (
              <Text style={styles.plantDescription}>
                {plant.description}
              </Text>
            )}
          </View>
        ))}
      </View> */}
      <View style={[styles.plantsContainer, isWideScreen && styles.plantsRow]}>
        {plants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} isWideScreen={isWideScreen} />
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
    paddingHorizontal: 10,
  },
  largeContainer: {
    alignItems: 'center',
    paddingHorizontal: 180,
  },
  title: {
    fontSize: 20,
    color: '#78B494',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0F5A32',
    marginBottom: 20 ,
  },
  plantsContainer: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
  },
  plantsRow: {
    flexDirection: 'row',
    justifyContent: 'center', // Alinea tarjetas a la derecha
    flexWrap: 'wrap',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
    borderRadius: 10,
    padding: 20,
    margin: 10,
  },
  errorText: {
    color: '#721c24',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PlantPage;
