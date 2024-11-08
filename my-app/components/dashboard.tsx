import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { LinearGradient } from 'expo-linear-gradient';


const screenWidth = Dimensions.get('window').width;

const Dashboard = () => {
  // Datos para los gráficos de ejemplo
  const data1 = [
    { value: 20, label: 'Ene' },
    { value: 80, label: 'Feb' },
    { value: 28, label: 'Mar' },
    { value: 80, label: 'Abr' },
    { value: 99, label: 'May' },
  ];

  const data2 = [
    { value: 10, label: 'Ene' },
    { value: 50, label: 'Feb' },
    { value: 60, label: 'Mar' },
    { value: 40, label: 'Abr' },
    { value: 75, label: 'May' },
  ];

  const data3 = [
    { value: 45, label: 'Ene' },
    { value: 60, label: 'Feb' },
    { value: 80, label: 'Mar' },
    { value: 65, label: 'Abr' },
    { value: 90, label: 'May' },
  ];

  return (
    <View style={styles.container}>
      {/* Tarjeta 1: Page Views */}
      <View style={[styles.card, { backgroundColor: '#6a62ff' }]}>
        <Text style={styles.title}>Page Views</Text>
        <Text style={styles.value}>127,425</Text>
        <LineChart
          data={data1}
          width={screenWidth - 40}
          height={150}
          color="#ffffff"
          thickness={2}
          hideDataPoints
          isAnimated
          noOfSections={4}
          yAxisColor="rgba(255, 255, 255, 0.5)"
          xAxisColor="rgba(255, 255, 255, 0.5)"
          areaChart
          startFillColor="rgba(255, 255, 255, 0.3)"
          endFillColor="rgba(255, 255, 255, 0)"
        />
      </View>

      {/* Tarjeta 2: Bounce Rate */}
      <View style={[styles.card, { backgroundColor: '#ff6060' }]}>
        <Text style={styles.title}>Bounce Rate</Text>
        <Text style={styles.value}>21.8%</Text>
        <LineChart
          data={data2}
          width={screenWidth - 40}
          height={150}
          color="#ffffff"
          thickness={2}
          hideDataPoints
          isAnimated
          noOfSections={4}
          yAxisColor="rgba(255, 255, 255, 0.5)"
          xAxisColor="rgba(255, 255, 255, 0.5)"
          areaChart
          startFillColor="rgba(255, 255, 255, 0.3)"
          endFillColor="rgba(255, 255, 255, 0)"
        />
      </View>

      {/* Tarjeta 3: Average Time */}
      <View style={[styles.card, { backgroundColor: '#ff6f91' }]}>
        <Text style={styles.title}>Average Time</Text>
        <Text style={styles.value}>05:34</Text>
        <LineChart
          data={data3}
          width={screenWidth - 40}
          height={150}
          color="#ffffff"
          thickness={2}
          hideDataPoints
          isAnimated
          noOfSections={4}
          yAxisColor="rgba(255, 255, 255, 0.5)"
          xAxisColor="rgba(255, 255, 255, 0.5)"
          areaChart
          startFillColor="rgba(255, 255, 255, 0.3)"
          endFillColor="rgba(255, 255, 255, 0)"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#181818',
  },
  card: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  value: {
    fontSize: 24,
    color: 'white',
    marginBottom: 10,
  }
});

export default Dashboard;
