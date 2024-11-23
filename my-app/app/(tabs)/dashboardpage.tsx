import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, } from 'react-native';
import { useQuery } from '@apollo/client';
import ChartWidget from '../../components/ChartWidget';
import { GET_MEASUREMENTS,Measurement } from '@/api/queries/queryMeasurements';
import { apiKey, endpoint } from '@/api/chatGpt/chatConfig';


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

  const { startOfDay, endOfDay } = getDayStartAndEnd();
  const [mesage,setMesage] = React.useState("");
  const { data, loading } = useQuery(GET_MEASUREMENTS, {
    variables: {
      
        where: {
          plant: {
            id: {//aqui deberia de venir el codigo de la planta seleccionada
              equals: "cm2v83y5c00007664w4dvdgx9" // codigo de planta
            }
          },
          AND: [
            {//aqui se pone el rango de fechas que viene de la funcion getDayStartAndEnd
              date_add: {
                gt: "2024-11-11T00:00:00.000Z",
                lt: "2024-11-22T00:00:00.000Z"
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
      tengo una planta de ${planta} y estas son las mediciones de luz, humedad y temperatura junto con la hora tomada de mi invernadero:
      ${mediciones}
      ¿Qué consejo me das para su cuidado?
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

 

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <Text style={styles.title}>Overview</Text>
      <Text style={styles.dashboardTitle}>Dashboard</Text>


      <ScrollView style={styles.tableContainer}  >
      <table style={styles.table}>
            <tr>
              <th>Light</th>
              <th>Humidity</th>
              <th>Temperature</th>
            </tr>
        {data.measurements.map((measurement: Measurement) => (
          <React.Fragment >
         
            <tr>
              <td>{measurement.light}</td>
              <td>{measurement.humidity}</td>
              <td>{measurement.temperature}</td>
            </tr>
          </React.Fragment>
        ))}
      </table>

      </ScrollView>


  
        <ChartWidget title="Temperature" value="127,425" data={dataTempetarure} color="#78B494" />
        <ChartWidget title="Humidity" value="21.8%" data={dataHumidity} color="#4B966E" />
        <ChartWidget title="Light" value="05:34" data={dataLight} color="#28784D" />
    
        
      
      <ScrollView  >
        <p> {mesage} </p>
      </ScrollView>
     
      
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  tableContainer: {   
    height: 150,
    width: 300,
    borderWidth: 1,
    borderColor: '#000',
    overflow: 'scroll',},

  table: {
    width: '100%',
     
    borderWidth: 1,
    borderColor: '#000',
    overflow: 'scroll',
  },

});

export default DashboardScreen;
