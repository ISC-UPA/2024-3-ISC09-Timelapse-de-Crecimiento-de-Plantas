import { list } from '@keystone-6/core';
import { text, timestamp, relationship } from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';
import { guestUser } from './GuestUser';

export const device = list({
  access: allowAll,
  fields: {
    name: text({
      validation: { isRequired: true },
      isIndexed: 'unique',  // Define un índice único para el campo "name" si es necesario
    }),
    ubication: text(),
    date_add: timestamp({ defaultValue: { kind: 'now' } }),
    plant: relationship({ ref: 'Plant.device',many:true }),
    measurements: relationship({ ref: 'Measurement.device', many: true }),
    images: relationship({ ref: 'UrlImage.device', many: true }),
    guestUser:relationship({ref:'GuestUser.device',many:true})
    
  },
});
