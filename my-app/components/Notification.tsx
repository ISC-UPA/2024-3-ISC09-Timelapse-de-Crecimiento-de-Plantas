// components/Notification.tsx
import React from 'react';
import { Platform, Alert } from 'react-native';

interface NotificationProps {
  message: string;
}

const Notification: React.FC<NotificationProps> = ({ message }) => {
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

  // Llamar a la función de alerta cuando el mensaje cambia
  React.useEffect(() => {
    if (message) {
      showAlert();
    }
  }, [message]);

  return null; // Este componente no necesita renderizar nada visible
};

export default Notification;
