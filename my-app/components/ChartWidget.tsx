import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

interface ChartWidgetProps {
  title: string;
  value: string;
  data: { value: number }[];
  color: string;
}

const ChartWidget: React.FC<ChartWidgetProps> = ({ title, value, data, color }) => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 1024;


  return (
    <View style={[styles.widgetContainer, isLargeScreen && styles.largeWidget]}>
      <View style={[styles.card, { backgroundColor: color }]}>
        <Text style={styles.widgetTitle}>{title}</Text>
        <Text style={styles.widgetValue}>{value}</Text>
        <LineChart
          data={data}
          width={isLargeScreen ? 300 : width * 0.8} // Ancho del gráfico          height={100}
          height={100}
          isAnimated
          thickness={2}
          color="#fff" // Línea del gráfico
          hideYAxisText
          initialSpacing={0}
          yAxisTextStyle={{ color: '#0F5A32' }}
          xAxisTextStyle={{ color: '#0F5A32' }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  widgetContainer: {
    marginVertical: 10,
    width: '90%', // Asegura que el contenedor sea un porcentaje fijo
    alignSelf: 'center', // Centra en pantallas pequeñas
  },
  largeWidget: {
    width: 350, // En pantallas grandes, fija el ancho
    marginHorizontal: 10, // Espaciado entre tarjetas
  },
  card: {
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden', // Asegura que el gráfico no sobresalga
  },
  widgetTitle: {
    fontSize: 18,
    color: '#0F5A32',
    fontWeight: '500',
  },
  widgetValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003C1C',
    marginBottom: 10,
  },
});

export default ChartWidget;
