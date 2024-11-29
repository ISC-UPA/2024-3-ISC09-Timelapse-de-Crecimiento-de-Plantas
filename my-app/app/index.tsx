import { useRouter } from 'expo-router';
import { useAuth } from '@/auth/authContext';
import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_USER } from '@/api/queries/queryUser';

export default function Index() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Verifica si el router está listo y el componente está montado
  useEffect(() => {
    if (!router) {
      return; // Espera hasta que el router esté listo
    }
    setIsMounted(true);
  }, [router]);

  const [getUser] = useLazyQuery(GET_USER, {
    onCompleted: (result: any) => {
      if (result?.guestUser) {
        console.log('Datos obtenidos:', result.guestUser.name);
        localStorage.setItem('device', result.guestUser.device.id);
        localStorage.setItem('username', result.guestUser.name);

        router.replace('/plants'); // Redirige a /plants
      }
    },
    onError: (error) => {
      console.error('Error al ejecutar la consulta:', error);
    },
  });

  useEffect(() => {
    if (!isMounted || !router|| loading) {
      return; // Espera a que el layout esté montado, el router esté listo y termine de cargar
    }

    if (!isAuthenticated) {
      console.log('No autenticado');
      router.replace('/login'); // Redirige a /login si no está autenticado
    } else {
      getUser({
        variables: {
          where: { email: localStorage.getItem('email') },
        },
      });
    }
  }, [loading, isAuthenticated, isMounted, router]);

  return null; // No renderiza nada mientras verifica el estado
}
