import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useQuery } from '@apollo/client';
import ChartWidget from '../../components/ChartWidget';
import { GET_MEASUREMENTS,Measurement } from '@/api/queries/queryMeasurements';
import { apiKey, endpoint } from '@/api/chatGpt/chatConfig';
import DataTable from '@/components/DataTable';
import Recommendations from '@/components/Recommendation';
import UserInfo from '@/components/UserInfo';

//se crea una funcion que retorna el inicio y fin del dia actual
const  getDayStartAndEnd =()=> {
  const now = new Date();

  // Inicio del día
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDayISO = startOfDay.toISOString();

  // Fin del día
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  const endOfDayISO = endOfDay.toISOString();

  return {
      startOfDay: startOfDayISO,
      endOfDay: endOfDayISO,
  };

}


const DashboardScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 1024;


  const { startOfDay, endOfDay } = getDayStartAndEnd();
  const [mesage,setMesage] = React.useState("");
  const { data, loading } = useQuery(GET_MEASUREMENTS, {
    variables: {
      
        where: {
          plant: {
            id: {//aqui deberia de venir el codigo de la planta seleccionada
              equals: "cm3ustdfq00003v36lqco3zht" // codigo de planta
            }
          },
          AND: [
            {//aqui se pone el rango de fechas que viene de la funcion getDayStartAndEnd
              date_add: {
                gt: startOfDay,
                lt: endOfDay,
              }
            }
          ]
        }
      }

  })

  

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#78B494" />
      </View>
    );

  }

 
//se crea un arreglo con los datos para los graficos
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


 

  const obtenerConsejo = async () => {
    const planta = "rosas";
  
    // Construir las mediciones dinámicamente
    const mediciones = data.measurements
      .map((measurement: Measurement) => {
        const { date_add, light, temperature, humidity } = measurement;
        return `${date_add},${light},${temperature},${humidity}`;
      })
      .join("\n"); // Unir las filas en líneas separadas
  
    // Construcción dinámica del contenido del prompt
    const promptContent = `
      I have a plant ${planta} and these are the light, humidity and temperature measurements along with the time taken from my greenhouse:
      ${mediciones}
      What advice do you have for its care?
    `;
  
    // Configuración de la solicitud
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
      max_tokens: 300,
    };
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(prompt),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log("Respuesta:", responseData.choices[0].message.content);
        setMesage(responseData.choices[0].message.content);
      } else {
        console.error(`Error: ${response.status}`);
        const errorData = await response.json();
        console.error(errorData);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

obtenerConsejo();
// Llamar a la función


    // Función para calcular el promedio de un array de números
    const calculateAverage = (values: number[]) => {
      const sum = values.reduce((acc, value) => acc + value, 0);
      return sum / values.length;
    };

    // Extraemos los valores de luz, humedad y temperatura
    const lightValues = data.measurements.map((measurement:Measurement) => measurement.light);
    const humidityValues = data.measurements.map((measurement:Measurement ) => measurement.humidity);
    const temperatureValues = data.measurements.map((measurement:Measurement) => measurement.temperature);

    // Calculamos los promedios
    const averageLight = calculateAverage(lightValues);
    const averageHumidity = calculateAverage(humidityValues);
    const averageTemperature = calculateAverage(temperatureValues);


 

  return (
    <ScrollView contentContainerStyle={[styles.container, isLargeScreen && styles.largeContainer]}>
      
      <Text style={styles.title}>Overview</Text>
      <Text style={styles.dashboardTitle}>Dashboard</Text>
      
      {/* Agregar UserInfo */}
      <UserInfo />

        <View style={[styles.widgetsContainer, isLargeScreen && styles.widgetsRow]}>
         
          <ChartWidget title="Temperature" value={averageLight.toFixed(2) + 'lx'} data={dataTempetarure} color="#78B494" />
          <ChartWidget title="Humidity" value={averageHumidity.toFixed(2) + '%'} data={dataHumidity} color="#4B966E" />
          <ChartWidget title="Light" value={averageTemperature.toFixed(2) + ' °C'} data={dataLight} color="#28784D" />

        </View>
  
        <Recommendations planta="Rosas" message={mesage} usuario='Fernanda' />

        <DataTable measurements={data.measurements} /> 


     
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  //EStilos de la página
  container: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 20,
    flexGrow: 1,
    alignItems: 'center', // Por defecto, centra las tarjetas
    paddingHorizontal: 10,

  },
  largeContainer: {
    alignItems: 'center', // En pantallas grandes, alinea hacia la izquierda
    paddingHorizontal: 180,
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
  //EStilo del loader container
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  //EStilos de las gráficas
  widgetsContainer: {
    flexDirection: 'column', // Por defecto, organiza en columna
    width: '100%',
    alignItems: 'center',
  },
  widgetsRow: {
    flexDirection: 'row', // En pantallas grandes, organiza en fila
    justifyContent: 'center', // Alinea hacia la derecha
    flexWrap: 'wrap',
  },

});

export default DashboardScreen;
