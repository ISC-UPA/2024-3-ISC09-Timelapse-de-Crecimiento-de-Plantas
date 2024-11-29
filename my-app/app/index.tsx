import { useRouter } from 'expo-router';
import { useAuth } from '@/auth/authContext'; // Usa el contexto de autenticación
import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_USER } from '@/api/queries/queryUser';
import { useState } from 'react';

export default function Index() {
  const { isAuthenticated, loading ,handleAuth} = useAuth();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  // Marca el componente como montado
  useEffect(() => {
    setIsMounted(true);
  }, []);

  
  const [getUser] = useLazyQuery(GET_USER, {
    onCompleted: (result:any) => {
     // console.log('Datos obtenidos:', result.guestUser);

      if (result?.guestUser) {
        console.log('Datos obtenidos:', result.guestUser.name);
        localStorage.setItem('device', result.guestUser. device.id);
        localStorage.setItem('username', result.guestUser. name);
        
        router.replace( '/plants')
      }
    },
    onError: (error) => {
      console.error('Error al ejecutar la consulta:', error);
    },
  });


  useEffect(() => {
    if (loading) {
      // Espera a que el layout esté completamente montado
      return;
    }

    if ( !isAuthenticated ) {
      console.log('No autenticado');
      console.log('email:',localStorage.getItem('email'));
      console.log('accestoken', localStorage.getItem('accessToken'))      // Redirige al login si no está autenticado
      router.replace('/login');
    } else if ( isAuthenticated) {
      // Redirige a /plants si está autenticado
      getUser({ variables: { where: { email:localStorage.getItem('email')  } } });
   
    }
  }, [loading, isAuthenticated, router,isMounted]);

  return null; // No renderiza nada, solo redirige
}