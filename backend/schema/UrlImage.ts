import { list } from '@keystone-6/core';
import { text, timestamp, relationship } from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';

export const urlImage = list({
  access: allowAll,
  fields: {
    url_image: text({ validation: { isRequired: true } }),
    date_add: timestamp({ defaultValue: { kind: 'now' } }),
    device: relationship({ ref: 'Device.images' }),
  },
});