import { list } from '@keystone-6/core';
import { text, timestamp, relationship } from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';
import { measurement } from './Mesurement';
import { recommendation } from './Recommendation';

export const urlImage = list({
  access: allowAll,
  fields: {
    url_image: text({ validation: { isRequired: true } }),
    date_add: timestamp({ defaultValue: { kind: 'now' } }),
    device: relationship({ ref: 'Device.images' }),
    mesurement:relationship({ref:'Measurement.image',many:true}),
    recommendation:relationship({ref:'Recommendation.image',many:false})
  },
});