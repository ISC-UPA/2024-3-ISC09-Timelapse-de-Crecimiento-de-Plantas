import React from 'react';
import { useQuery } from '@apollo/client';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import PlantCard from '@/components/PlantCard';
import { GET_PLANTS, Plant } from '@/api/queries/queryPlants';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Importa los íconos de Expo

const PlantPage: React.FC = () => {
  const { width } = useWindowDimensions();
  const isWideScreen = width > 1024; // Determina si está en pantalla grande
  const iddevice = useLocalSearchParams();
  const router = useRouter(); // Hook para manejar navegación

  const { data, loading, error } = useQuery(GET_PLANTS, {
    variables: {
      where: {
        device: {
          id: {
            equals: iddevice.id, // Id del dispositivo al que están asignadas las plantas
          },
        },
      },
      skip: !iddevice,
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
      {/* Ícono de flecha para volver */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#78B494" />
      </TouchableOpacity>

      <Text style={styles.title}>Plants</Text>
      <Text style={styles.subtitle}>Choose a plant</Text>

      <View style={[styles.plantsContainer, isWideScreen && styles.plantsRow]}>
        {plants.map((plant) => (
          <Link
            key={plant.id}
            href={{ pathname: '/plants/dashboard/[id]', params: { id: plant.id } }} // Ruta dinámica
          >
            <PlantCard plant={plant} isWideScreen={isWideScreen} />
          </Link>
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2, // Para sombra en Android
  },
  title: {
    fontSize: 20,
    color: '#78B494',
    marginTop: 20, // Ajusta para que no se superponga con el botón
  },
  subtitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0F5A32',
    marginBottom: 20,
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
