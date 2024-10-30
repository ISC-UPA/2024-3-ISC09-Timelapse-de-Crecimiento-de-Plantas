import { list } from '@keystone-6/core';
import { timestamp, float, relationship } from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';

export const measurement = list({
  access: allowAll,
  fields: {
    date_add: timestamp({ defaultValue: { kind: 'now' } }),
    temperature: float(),
    humidity: float(),
    light: float(),
    plant: relationship({ ref: 'Plant.measurements' }),
    device: relationship({ ref: 'Device.measurements' }),
    recommendations: relationship({ ref: 'Recommendation.measurement', many: true }),
  },
});