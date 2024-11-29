import React from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { Measurement } from '@/api/queries/queryMeasurements';

interface DataTableProps {
  measurements: Measurement[];
}

const DataTable: React.FC<DataTableProps> = ({ measurements }) => {
  const { width } = useWindowDimensions(); // Obtenemos las dimensiones de la ventana
  const isLargeScreen = width > 1024; // Consideramos pantallas grandes como aquellas con un ancho mayor a 1024px

  // Función para obtener el estado de humedad (wet/dry)
  const getHumidityStatus = (humidity: number) => {
    if (humidity === 1) {
      return 'Wet';
    } else if (humidity === 0) {
      return 'Dry';
    } else {
      return `${humidity.toFixed(2)}%`; // Si no es 1 o 0, mostramos el valor como porcentaje
    }
  };

  return (
    <ScrollView style={[styles.tableContainer, isLargeScreen && styles.largeTableContainer]}>
      <Text style={styles.title}>Historical Data</Text>  {/* Título agregado aquí */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, isLargeScreen && styles.largeTableHeaderText]}>Time</Text>
        <Text style={[styles.tableHeaderText, isLargeScreen && styles.largeTableHeaderText]}>Light (lx)</Text>
        <Text style={[styles.tableHeaderText, isLargeScreen && styles.largeTableHeaderText]}>Humidity (%)</Text>
        <Text style={[styles.tableHeaderText, isLargeScreen && styles.largeTableHeaderText]}>Temperature (°C)</Text>
      </View>
      {/* Contenedor de las filas con overflow */}
      <ScrollView style={styles.tableRowsContainer}>
        {measurements.map((measurement, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>
              {new Date(measurement.date_add).toLocaleString([], { hour: '2-digit', hour12: true })}
            </Text>
            <Text style={styles.tableCell}>{measurement.light} lx</Text>
            <Text style={styles.tableCell}>{getHumidityStatus(measurement.humidity)}</Text>
            <Text style={styles.tableCell}>{measurement.temperature} °C</Text>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#4B966E',
    overflow: 'scroll',
    marginVertical: 10,
    alignSelf: 'center', // Centra la tabla en la pantalla
    width: '90%', // En pantallas pequeñas, ocupa el 90% del ancho de la pantalla
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 15,
    color: '#fff',
  },
  largeTableContainer: {
    width: '95%', // En pantallas grandes, limita el ancho a 800px
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  tableHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    flex: 1,
    textAlign: 'center',
  },
  largeTableHeaderText: {
    fontSize: 16, // Aumenta el tamaño de la fuente en pantallas grandes
  },
  tableRow: {
    color: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
  },
  tableRowsContainer: {
    maxHeight: 300, // Limita la altura de la tabla antes de hacer scroll (ajusta según tus necesidades)
    overflow: 'auto', // Esto permite el desbordamiento
  },
});

export default DataTable;
