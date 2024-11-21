import { gql } from '@apollo/client';

export interface Measurement {
    light: number,
    humidity: boolean,
    temperature: number;
    image: string;
}

export const  GET_MEASUREMENTS = gql`query Measurements($where: MeasurementWhereInput!) {
    measurements(where: $where) {
        light
        humidity
        temperature
        image {
              url_image
        }
    }
}`

/*
    Ejemplo del where que deberia de enviarse en esta peticion 

    {
  "where": {
    "date_add": {
    "gt": "2024-11-11T00:00:00.000Z", fecha mayor que 
    "lt": "2024-11-22T00:00:00.000Z" fecha menor que
            }
        }
    }
 
 */



