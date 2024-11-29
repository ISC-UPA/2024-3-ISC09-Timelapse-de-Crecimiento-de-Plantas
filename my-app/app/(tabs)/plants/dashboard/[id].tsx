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
import UserInfo from '../../../../components/UserInfo';

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
  const [message, setMessage] = React.useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
  
  // Aquí podrías agregar condicionales para Device y Email
  const isDeviceConnected = true; // Cambia esto a la lógica que desees
  const hasEmailVerified = true;  // Cambia esto a la lógica que desees

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
        setMessage(responseData.choices[0].message.content);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode); // Cambiar entre los temas
  };

  const noDataAvailable = !data || !data.measurements || data.measurements.length === 0;

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#78B494" />
      </View>
    );
  }

  if (noDataAvailable) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No measurements available for this plant</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/')}>
          <Text style={styles.loginButtonText}>Back to login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const dataTempetarure = data.measurements.map((measurement: Measurement) => {
    return { value: measurement.temperature };
  });
  const dataHumidity = data.measurements.map((measurement: Measurement) => {
    return { value: measurement.humidity };
  });
  const dataLight = data.measurements.map((measurement: Measurement) => {
    return { value: measurement.light };
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

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('issuedAt');
    router.push('/');
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, isLargeScreen && styles.largeContainer, isDarkMode && styles.darkMode]}>
      <TouchableOpacity style={[styles.backButton, isDarkMode && styles.darkBackButton]} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color={isDarkMode ? "#fff" : "#78B494"} />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.iconButton, isDarkMode && styles.darkIconButton]} onPress={toggleTheme}>
        <Icon name={isDarkMode ? 'sun-o' : 'moon-o'} size={20} color={isDarkMode ? '#fff' : '#78B494'} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.logoutButton, isDarkMode && styles.darkLogoutButton]} onPress={handleLogout}>
        <Text style={[styles.logoutButtonText, isDarkMode && styles.darkLogoutButtonText]}>Logout</Text>
      </TouchableOpacity>

      <Text style={[styles.title, isDarkMode && styles.darkTitle]}>Overview</Text>
      <UserInfo />

      <Text style={[styles.dashboardTitle, isDarkMode && styles.darkDashboardTitle]}>Dashboard</Text>

      <View style={[styles.widgetsContainer, isLargeScreen ? styles.widgetsRow : styles.widgetsColumn]}>
        <ChartWidget title="Temperature" value={averageLight.toFixed(2) + ' °C'} data={dataTempetarure} color="#78B494" />
        <ChartWidget title="Humidity" value={averageHumidity.toFixed(2) + '%'} data={dataHumidity} color="#4B966E" />
        <ChartWidget title="Light" value={averageTemperature.toFixed(2) + 'lx'} data={dataLight} color="#28784D" />
      </View>

      <Recommendations planta={params.name} message={message} usuario={username} />
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
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#78B494',
    padding: 10,
    borderRadius: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
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
  widgetsColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  darkIconButton: {
    color: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  darkBackButton: {
    color: '#fff',
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 60,
  },
  darkLogoutButton: {
    backgroundColor: '#333',
  },
  logoutButtonText: {
    fontSize: 14,
    color: '#78B494',
  },
  darkLogoutButtonText: {
    color: '#fff',
  },
  deviceContainer: {
    marginTop: 20,
  },
  deviceConnected: {
    backgroundColor: '#78B494',
  },
  deviceDisconnected: {
    backgroundColor: '#FF6F61',
  },
  emailContainer: {
    marginTop: 20,
  },
  emailVerified: {
    backgroundColor: '#78B494',
  },
  emailNotVerified: {
    backgroundColor: '#FF6F61',
  },
});

export default DashboardScreen;
