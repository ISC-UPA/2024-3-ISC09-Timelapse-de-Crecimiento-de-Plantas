import React from 'react';
import { useQuery } from '@apollo/client';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions 
} from 'react-native';
import { GET_PLANTS ,Plant } from '@/api/queries/queryPlants';

// Define la interfaz para el tipo de plant

const screenWidth = Dimensions.get('window').width;
const isWideScreen = screenWidth > 800;

const PlantPage: React.FC = () => {

  const { data, loading, error } = useQuery(GET_PLANTS, {
    variables: {
      where: {
        device: {
          id: {
            equals: 'cm2v83y5c00007664w4dvdgx9',//Id del dispositivo al que esta asignada las plantas que regresara la pericion 
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Plants</Text>

     {
        ///recorre el array de plants tipando cada elemento con la interface platas declarada arriba
     } 
      
      <View style={styles.plantsContainer}>
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
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
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
  plantsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  plantCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  plantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 5,
  },
  plantDescription: {
    fontSize: 14,
    color: '#6c757d',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 20,
  },
});

export default PlantPage;
