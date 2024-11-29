import React, { useEffect, useState } from 'react';
import gifshot from 'gifshot';
import { View, Text, Image, StyleSheet } from 'react-native';

interface GifGeneratorProps {
  imageUrls: string[]; // URLs de las imágenes
}

const GifGenerator: React.FC<GifGeneratorProps> = ({ imageUrls }) => {
  const [gifUrl, setGifUrl] = useState<string | null>(null);

  useEffect(() => {
    if (imageUrls.length > 0) {
      gifshot.createGIF(
        {
          images: imageUrls,
          gifWidth: 300,
          gifHeight: 300,
          interval: 0.5,
        },
        (obj) => {
          if (!obj.error) {
            setGifUrl(obj.image);
          } else {
            console.error('Error al crear el GIF:', obj.errorMsg);
          }
        }
      );
    }
  }, [imageUrls]);

  return (
    <View style={styles.container}>
      {gifUrl ? (
        <Image source={{ uri: gifUrl }} style={styles.gif} />
      ) : (
        <Text>Generando GIF...</Text>
      )}
    </View>
  );
};

export default GifGenerator;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  gif: { width: 300, height: 300 },
});
