import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ChartWidget from '../../components/ChartWidget';
import { GET_PLANTS } from '@/api/queries/queryPlants';
import client from '@/api/apolloClient';


const DashboardScreen: React.FC = () => {

  


  const data = [
    { value: 50 }, { value: 80 }, { value: 45 }, { value: 75 }, { value: 60 },
    { value: 90 }, { value: 100 }, { value: 55 }, { value: 85 }, { value: 70 }
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Overview</Text>
      <Text style={styles.dashboardTitle}>Dashboard</Text>

      <ChartWidget title="Temperature" value="127,425" data={data} color="#78B494" />
      <ChartWidget title="Humidity" value="21.8%" data={data} color="#4B966E" />
      <ChartWidget title="Light" value="05:34" data={data} color="#28784D" />
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    paddingVertical: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    color: '#78B494',
    marginTop: 20,
  },
  dashboardTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0F5A32',
    marginBottom: 20,
  },
});

export default DashboardScreen;
