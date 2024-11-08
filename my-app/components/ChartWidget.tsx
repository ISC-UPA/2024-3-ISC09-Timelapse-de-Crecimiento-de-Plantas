// src/components/ChartWidget.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

interface ChartWidgetProps {
  title: string;
  value: string;
  data: { value: number }[];
  color: string;
}

const ChartWidget: React.FC<ChartWidgetProps> = ({ title, value, data, color }) => {
  return (
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
        // hideAxeAndRules
        hideYAxisText
        initialSpacing={0}
        yAxisTextStyle={{ color: '#0F5A32' }}
        xAxisTextStyle={{ color: '#0F5A32' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  widgetContainer: {
    width: '90%',
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
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
