import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface GifSimulatorProps {
  imageUrls: string[]; // URLs de las imágenes
  frameRate?: number; // Cuántos cuadros por segundo (FPS)
}

const GifSimulator: React.FC<GifSimulatorProps> = ({ imageUrls, frameRate = 10 }) => {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    if (imageUrls.length > 0) {
      // Calcula el intervalo en milisegundos basado en los FPS
      const interval = 1000 / frameRate;

      const timer = setInterval(() => {
        setCurrentFrame((prevFrame) => (prevFrame + 1) % imageUrls.length);
      }, interval);

      // Limpia el intervalo cuando el componente se desmonta
      return () => clearInterval(timer);
    }
  }, [imageUrls, frameRate]);

  if (imageUrls.length === 0) {
    return null; // No hay imágenes para mostrar
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrls[currentFrame] }} style={styles.image} />
    </View>
  );
};

export default GifSimulator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
  },
});
