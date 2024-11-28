import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import PlantCard from '@/components/PlantCard';
import { GET_PLANTS, Plant } from '@/api/queries/queryPlants';
import { Link, useRouter } from 'expo-router';
import { FontAwesome as Icon } from '@expo/vector-icons'; // Importa los íconos de FontAwesome

const PlantPage: React.FC = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWideScreen = width > 1024; // Determina si está en pantalla grande
  const [userDeviceId, setUserDeviceId] = useState<string | null>(localStorage.getItem('device'));

  // Detecta el tema del sistema
  const systemTheme = useColorScheme(); // 'light' o 'dark'
  const [isDarkMode, setIsDarkMode] = useState(systemTheme === 'dark'); // Estado para el tema

  // Cambia el tema manualmente
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Escucha cambios en el tema del sistema
  useEffect(() => {
    setIsDarkMode(systemTheme === 'dark');
  }, [systemTheme]);

  // Query para obtener las plantas del dispositivo
  const { data, loading, error } = useQuery(GET_PLANTS, {
    skip: !userDeviceId,
    variables: {
      where: {
        device: {
          id: {
            equals: userDeviceId,
          },
        },
      },
    },
  });

  // Estilos dinámicos según el tema
  const dynamicStyles = getStyles(isDarkMode);

  if (loading) {
    return (
      <View style={dynamicStyles.loaderContainer}>
        <ActivityIndicator size="large" color="#78B494" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={dynamicStyles.errorContainer}>
        <Text style={dynamicStyles.errorText}>Error al cargar las plantas.</Text>
      </View>
    );
  }

  const plants: Plant[] = data?.plants || [];

  // Verifica si no hay plantas
  if (plants.length === 0) {
    return (
      <View style={dynamicStyles.container}>
        <View style={dynamicStyles.noPlantsContainer}>
        <Text style={dynamicStyles.noPlantsMessage}>No plants available for this device.</Text>
        <TouchableOpacity
            style={dynamicStyles.goBackButton}
            onPress={() => router.push('/')}
          >
            <Text style={dynamicStyles.goBackButtonText}>Back to login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[dynamicStyles.container, isWideScreen && dynamicStyles.largeContainer]}>
      {/* Botón para alternar tema */}
      <TouchableOpacity
        style={[dynamicStyles.iconButton, isDarkMode && dynamicStyles.darkIconButton]}
        onPress={toggleTheme}
      >
        <Icon
          name={isDarkMode ? 'sun-o' : 'moon-o'} // Cambia el icono según el tema
          size={20}
          color={isDarkMode ? '#fff' : '#78B494'}
          style={dynamicStyles.icon}
        />
      </TouchableOpacity>

      <Text style={dynamicStyles.title}>Plants</Text>
      <Text style={dynamicStyles.subtitle}>Choose a plant</Text>

      <View style={[dynamicStyles.plantsContainer, isWideScreen && dynamicStyles.plantsRow]}>
        {plants.map((plant) => (
          <Link
            key={plant.id}
            href={{ pathname: '/plants/dashboard/[id]', params: { id: plant.id, name: plant.name} }}
          >
            <PlantCard plant={plant} isWideScreen={isWideScreen} />
          </Link>
        ))}
      </View>
    </ScrollView>
  );
};

// Función para obtener estilos dinámicos según el tema
const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#1E1E1E' : '#f1f1f1',
      paddingVertical: 20,
      flexGrow: 1,
      paddingHorizontal: 15,
    },
    largeContainer: {
      alignItems: 'center',
      paddingHorizontal: '15%',
    },
    title: {
      fontSize: 20,
      color: isDarkMode ? '#A4D08D' : '#000',
      marginTop: 20,
    },
    subtitle: {
      fontSize: 32,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#0F5A32',
      marginBottom: 20,
    },
    plantsContainer: {
      flexDirection: 'column',
      width: '100%',
      alignItems: 'center',
    },
    plantsRow: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
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
      backgroundColor: isDarkMode ? '#77212b' : '#f8d7da',
      borderRadius: 10,
      padding: 20,
      margin: 10,
    },
    errorText: {
      color: isDarkMode ? '#fff' : '#721c24',
      fontSize: 16,
      fontWeight: 'bold',
    },
    iconButton: {
      position: 'absolute',
      top: 20,
      right: 20,
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 5,
      zIndex: 1,
      backgroundColor: '#fff',
    },
    darkIconButton: {
      backgroundColor: '#000',
    },
    icon: {
      fontSize: 20,
    },
    noPlantsMessage: {
      fontSize: 18,
      color: isDarkMode ? '#fff' : '#000',
      textAlign: 'center',
      marginTop: 20,
    },
    noPlantsContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    goBackButton: {
      marginTop: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#78B494',
      borderRadius: 5,
    },
    goBackButtonText: {
      fontSize: 16,
      color: '#fff',
      textAlign: 'center',
    }
  });

export default PlantPage;
