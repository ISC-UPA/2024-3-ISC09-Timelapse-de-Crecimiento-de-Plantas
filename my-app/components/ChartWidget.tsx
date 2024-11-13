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

  return (
    <View style={[styles.container, width > 1024 ? styles.horizontalLayout : null]}>
      <View style={[styles.widgetContainer, { backgroundColor: color }]}>
        <Text style={styles.widgetTitle}>{title}</Text>
        <Text style={styles.widgetValue}>{value}</Text>
        <LineChart
          data={data}
          width={300}
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
  container: {
    flex: 1,
    
  },
  horizontalLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  widgetContainer: {
    // padding: 15,
    // borderRadius: 12,
    // marginVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    // alignItems: '',
    
  },
  widgetTitle: {
    fontSize: 18,
    color: '#0F5A32',
  },
  widgetValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003C1C',
    marginBottom: 10,
  },
});

export default ChartWidget;
