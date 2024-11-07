// components/Notification.tsx
import React, { useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';

interface NotificationProps {
  message: string;
}

const Notification: React.FC<NotificationProps> = ({ message }) => {
  const [canShowAlert, setCanShowAlert] = useState(true); // Estado para controlar el cooldown

  // Función para mostrar la notificación de alerta
  const showAlert = () => {
    if (Platform.OS === 'web') {
      // Para web, usamos window.alert
      window.alert(message);
    } else {
      // Para iOS/Android, usamos la API Alert de React Native
      Alert.alert('Error', message);
    }
  };

  // Llamar a la función de alerta cuando el mensaje cambia y el cooldown esté permitido
  useEffect(() => {
    if (message && canShowAlert) {
      showAlert();
      setCanShowAlert(false); // Deshabilitar el envío de notificaciones durante el cooldown

      // Reactivar el envío de notificaciones después de 5 segundos
      const timer = setTimeout(() => {
        setCanShowAlert(true);
      }, 50);

      // Limpiar el timeout cuando el componente se desmonte
      return () => clearTimeout(timer);
    }
  }, [message, canShowAlert]);

  return null; // Este componente no necesita renderizar nada visible
};

export default Notification;
