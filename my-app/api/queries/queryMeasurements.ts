import { gql } from '@apollo/client';


export interface Measurement {
    light: number,
    humidity: number,
    temperature: number;
    image: string;
    date_add: string;
}

export const  GET_MEASUREMENTS = gql`query Measurements($where: MeasurementWhereInput!) {
    measurements(where: $where) {
        light
        humidity
        temperature
        image {
              url_image
        }
        date_add
    }
}`

/* ejemplo de query
 {
  "where": {
    "plant": {
      "id": {
        "equals": "cm2v83y5c00007664w4dvdgx9" codigo de planta
      }
    },
    "AND": [
      {
        "date_add": {
          "gt": "2024-11-11T00:00:00.000Z",
          "lt": "2024-11-22T00:00:00.000Z"
        }
      }
    ]
  }
}
 */



