import React, { useEffect, useState } from 'react';
import { useQuery,useLazyQuery } from '@apollo/client';
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
import { GET_USER, User } from '@/api/queries/queryUser';

const PlantPage: React.FC = () => {


  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWideScreen = width > 1024; // Determina si está en pantalla grande

  const [email, setEmail] = useState<string | null>(localStorage.getItem('email'));
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [userDeviceId, setUserDeviceId] = useState<string | null>(null);
  const [getUser,  { data: userData, loading: userLoading, error: userError }] = useLazyQuery(GET_USER);
  

  // Obtiene el email almacenado en AsyncStorage
  //useEffect(() => {
//
//
  //  const loadEmail = async () => {
  //    try {
  //      const storedEmail = await localStorage.getItem('email');
  //      //const storedEmail="false"
  //      console.log('Correo cargado desde localStorage:', storedEmail);
  //      setEmail(storedEmail);
  //    } catch (err) {
  //      console.error('Error al cargar el email:', err);
  //    }
  //  };
  //  loadEmail();
 //
  //}, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (email) {
        console.log('Ejecutando consulta con email:', email);
        getUser({ variables: { where: { email:email } } });
      }else {
      
        router.replace('/access-denied');
      }
    };
    fetchUser();
  }, []);

  // Query para obtener datos del usuario basado en el email
  //const { data: userData, loading: userLoading, error: userError } = useQuery<{ guestUser: User }>(GET_USER, {
  //  skip: !email, // Solo ejecutar si hay email
  //  variables: { where: { email } },
  //});

 



  // Verificación de usuario y autorización
  useEffect(() => {
    if (userLoading || userError) return; // Evita redirecciones prematuras mientras carga o si hay error
    if (userData?.guestUser) {
      const user = userData.guestUser;
      console.log('Datos del usuario:', user);

      // Establece el ID del dispositivo y la autorización
      setUserDeviceId(user.device.id);
      setIsAuthorized(true);

      // Redirige al ID del dispositivo
      router.push(`/plants/${user.device.id}`);
    } else {
      console.log('Acceso denegado: usuario no encontrado.');

      // Reemplaza la URL actual si no está autorizado
      router.replace('/access-denied');
    }
  }, [userLoading, userError, userData, setUserDeviceId, setIsAuthorized, router]);

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

  // Renderizado del componente
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
