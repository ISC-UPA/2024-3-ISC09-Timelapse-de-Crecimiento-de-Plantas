import { config } from '@keystone-6/core'
import { lists } from './schema/Schema';

export default config({
  db: {
    provider: 'sqlite',
    url: 'file:./db/vivePlanta.db',
  },
  lists,
  server: {
    cors: {
      origin: '*',  // Permite todos los orígenes
      credentials: true,  // Permitir cookies y encabezados de autenticación
    },
  },
  //session,
});