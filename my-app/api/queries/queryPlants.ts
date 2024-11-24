import { gql } from '@apollo/client';

export interface Plant {
  id: string;
  name: string;
  description?: string; // Propiedad opcional
}


export const GET_PLANTS = gql`
query Plants($where: PlantWhereInput!) {
  plants(where: $where) {
    id
    name
    measurements {
      humidity
      light
      image {
        url_image
      }
      temperature
    }
  }
}
`;
