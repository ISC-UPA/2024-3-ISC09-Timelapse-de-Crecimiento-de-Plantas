import { list } from '@keystone-6/core';
import { relationship, text } from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';

export const guestUser = list({
  access: allowAll,
  fields: {
    id_azure: text({
      validation: { isRequired: true },
      isIndexed: 'unique',  // Configura el campo como único
    }),
    device: relationship(
       {ref: "Device.guestUser" , many:false },
      
    ),
    name: text({
      validation: { isRequired: true },
    }),
    email: text({
      validation: { isRequired: true },
      isIndexed: 'unique',  // Configura el campo como único
    }),
  },
});
