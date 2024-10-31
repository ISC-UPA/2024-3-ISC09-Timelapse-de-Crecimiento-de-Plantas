import { list } from '@keystone-6/core';
import { text, timestamp, relationship } from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';

export const plant = list({
  access: allowAll,
  fields: {
    name: text({ validation: { isRequired: true } }),
    date_add: timestamp({ defaultValue: { kind: 'now' } }),
    device: relationship({ ref: 'Device.plant', many: false }),
    measurements: relationship({ ref: 'Measurement.plant', many: true }),
  },
});