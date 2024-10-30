import { list } from '@keystone-6/core';
import { text, timestamp, relationship } from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';

export const recommendation = list({
  access: allowAll,
  fields: {
    description: text({ validation: { isRequired: true } }),
    date_add: timestamp({ defaultValue: { kind: 'now' } }),
    measurement: relationship({ ref: 'Measurement.recommendations' }),
  },
});