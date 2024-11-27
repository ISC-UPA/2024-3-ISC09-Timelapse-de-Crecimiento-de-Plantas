import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  useWindowDimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PlantCard from '@/components/PlantCard';
import { GET_PLANTS, Plant } from '@/api/queries/queryPlants';
import { GET_USER, User } from '@/api/queries/queryUser';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';

const PlantPage: React.FC = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWideScreen = width > 1024; // Determina si está en pantalla grande
  const iddevice = useLocalSearchParams();

  const [email, setEmail] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [userDeviceId, setUserDeviceId] = useState<string | null>(null);

  console.log('Correo para consulta:', email);

  // Query para obtener información del usuario
  const { data: userData, loading: userLoading, error: userError } = useQuery<{ guestUser: User }>(GET_USER, {
    skip: !email, // Solo ejecutar si hay email
    variables: { where: { email } }, // Usa el valor de estado
  });
  
  // Query para obtener las plantas del dispositivo
  const { data, loading, error } = useQuery(GET_PLANTS, {
    skip: !isAuthorized || !userDeviceId, // Ejecutar solo si está autorizado y tiene dispositivo
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

  // Obtener el email del usuario al montar el componente
  useEffect(() => {
    const loadEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('email');
        console.log('Correo cargado desde AsyncStorage:', storedEmail);  // Verifica si el correo se carga correctamente
        setEmail(storedEmail);
      } catch (err) {
        console.error('Error al cargar el email:', err);
      }
    };
    loadEmail();
  }, []);

  // Verificar la autorización del usuario
  useEffect(() => {
    if (userLoading) return; // Evita redirecciones si aún está cargando

    if (userData && userData.guestUser) {
      const user = userData.guestUser;
      console.log('Datos del usuario:', user);
      setUserDeviceId(user.device.id);
      setIsAuthorized(true);

      // Redirige después de obtener los datos
      router.push({
        pathname: `/plantss/${user.device.id}`, // Redirige al ID del dispositivo
      });
    } else {
      // Maneja el caso cuando el usuario no existe o los datos no son correctos
      console.log('Acceso denegado: usuario no encontrado.');
      Alert.alert('Acceso denegado', 'No estás autorizado para acceder a esta aplicación.');
      router.replace('access-denied');
    }
  }, [userData, userLoading]);

  if (userLoading || loading) {
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
      <View style={[styles.plantsContainer, isWideScreen && styles.plantsRow]}>
        {plants.map((plant) => (
          <Link
            key={plant.id}
            href={{ pathname: '/plants/dashboard/[id]', params: { id: plant.id } }}
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
  title: {
    fontSize: 20,
    color: '#78B494',
    marginTop: 20,
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
