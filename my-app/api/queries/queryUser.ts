import { gql } from '@apollo/client';

export interface User  {
    id: string;
    name:string;
    email:string;
    device: string;
}


/* Where de la consulta, 
  {
  "where": {
      "email": aqui deberia de venir el email del usuario en sesion 
  }
}
 */


export const GET_USER = gql`
query GuestUser($where: GuestUserWhereUniqueInput!) {
  guestUser(where: $where) {
    id
    name
    device {
      id
    }
    email
  }
}
`