import Icon from 'react-native-vector-icons/FontAwesome'; // Importar los iconos de FontAwesome
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, useWindowDimensions, TouchableOpacity } from 'react-native';
import { useQuery } from '@apollo/client';
import ChartWidget from '@/components/ChartWidget';
import { GET_MEASUREMENTS, Measurement } from '@/api/queries/queryMeasurements';
import { apiKey, endpoint } from '@/api/chatGpt/chatConfig';
import DataTable from '@/components/DataTable';
import Recommendations from '@/components/Recommendation';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { id } = useLocalSearchParams();
const getDayStartAndEnd = () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDayISO = startOfDay.toISOString();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  const endOfDayISO = endOfDay.toISOString();
  return {
    startOfDay: startOfDayISO,
    endOfDay: endOfDayISO,
  };
};

const DashboardScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 1024;
  const params = useLocalSearchParams();
  const { startOfDay, endOfDay } = getDayStartAndEnd();
  const [mesage, setMesage] = React.useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));

  const { data, loading } = useQuery(GET_MEASUREMENTS, {
    variables: {
      where: {
        plant: {
          id: {
            equals: params.id,
          },
        },
        AND: [
          {
            date_add: {
              gt: startOfDay,
              lt: endOfDay,
            },
          },
        ],
      },
    },
  });

  useEffect(() => {
    obtenerConsejo();
  }, [data]);

  const obtenerConsejo = async () => {
    const planta = params.name;
    const mediciones = data.measurements
      .map((measurement: Measurement) => {
        const { date_add, light, temperature, humidity } = measurement;
        return `${date_add},${light},${temperature},${humidity}`;
      })
      .join("\n");
    const promptContent = `
       I have a plant ${planta} and here are the light, humidity, and temperature measurements from my greenhouse:
      ${mediciones}
      Provide a brief care recommendation for this plant (keep it short).
    `;
    const headers = {
      "Content-Type": "application/json",
      "api-key": apiKey,
    };
    const prompt = {
      messages: [
        {
          role: "user",
          content: promptContent,
        },
      ],
      max_tokens: 150,
    };
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(prompt),
      });
      if (response.ok) {
        const responseData = await response.json();
        setMesage(responseData.choices[0].message.content);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode); // Cambiar entre los temas
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#78B494" />
      </View>
    );
  }

  const dataTempetarure = data.measurements.map((measurement: Measurement) => {
    return {
      value: measurement.temperature,
    };
  });
  const dataHumidity = data.measurements.map((measurement: Measurement) => {
    return {
      value: measurement.humidity,
    };
  });
  const dataLight = data.measurements.map((measurement: Measurement) => {
    return {
      value: measurement.light,
    };
  });

  const calculateAverage = (values: number[]) => {
    const sum = values.reduce((acc, value) => acc + value, 0);
    return sum / values.length;
  };

  const lightValues = data.measurements.map((measurement: Measurement) => measurement.light);
  const humidityValues = data.measurements.map((measurement: Measurement) => measurement.humidity);
  const temperatureValues = data.measurements.map((measurement: Measurement) => measurement.temperature);

  const averageLight = calculateAverage(lightValues);
  const averageHumidity = calculateAverage(humidityValues);
  const averageTemperature = calculateAverage(temperatureValues);

  return (
    <ScrollView contentContainerStyle={[styles.container, isLargeScreen && styles.largeContainer, isDarkMode && styles.darkMode]}>
      <TouchableOpacity 
      style={[styles.backButton, isDarkMode && styles.darkBackButton]} 
      onPress={() => router.back()}>
      <Ionicons 
        name="arrow-back" 
        size={20} 
        color={isDarkMode ? "#fff" : "#78B494"} // Flecha blanca en modo oscuro
      />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.iconButton, isDarkMode && styles.darkIconButton]} onPress={toggleTheme}>
        <Icon
          name={isDarkMode ? 'sun-o' : 'moon-o'} // Usando iconos de FontAwesome
          size={20}
          color={isDarkMode ? '#fff' : '#78B494'}
          style={styles.icon}
        />
      </TouchableOpacity>

      <Text style={[styles.title, isDarkMode && styles.darkTitle]}>Overview</Text>
      <Text style={[styles.dashboardTitle, isDarkMode && styles.darkDashboardTitle]}>Dashboard</Text>

      <View style={[styles.widgetsContainer, isLargeScreen && styles.widgetsRow]}>
        <ChartWidget title="Temperature" value={averageLight.toFixed(2) + 'lx'} data={dataTempetarure} color="#78B494" />
        <ChartWidget title="Humidity" value={averageHumidity.toFixed(2) + '%'} data={dataHumidity} color="#4B966E" />
        <ChartWidget title="Light" value={averageTemperature.toFixed(2) + ' °C'} data={dataLight} color="#28784D" />
      </View>

      <Recommendations planta={params.name} message={mesage} usuario={username} />
      <DataTable measurements={data.measurements} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 20,
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  darkMode: {
    backgroundColor: '#1E1E1E',
  },
  largeContainer: {
    alignItems: 'center',
    paddingHorizontal: '20%',
  },
  title: {
    fontSize: 20,
    color: '#000',
    marginTop: 20,
  },
  darkTitle: {
    color: '#A4D08D', // Verde claro para el título en modo oscuro
  },
  dashboardTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0F5A32',
    marginBottom: 20,
  },
  darkDashboardTitle: {
    color: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  widgetsContainer: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
  },
  widgetsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  iconButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    zIndex: 1,
    backgroundColor: '#fff',
  },
  darkIconButton:{
    backgroundColor: '#000'
    
  }
  ,
  icon: {
    fontSize: 20,
  },
  darkBackButton: {
    backgroundColor: '#000', // Fondo negro en modo oscuro
  },
});

export default DashboardScreen;
