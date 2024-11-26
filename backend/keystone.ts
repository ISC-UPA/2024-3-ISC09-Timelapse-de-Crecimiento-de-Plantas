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
      origin: '*', // Permitir todos los orígenes
      credentials: true, // Habilitar el uso de credenciales (para cookies o tokens)
    },
  },
  //session,
});