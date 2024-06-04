/**
 * enclosure router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::enclosure.enclosure', {
  config: {
    find: {
      middlewares: ['api::enclosure.get-owned-enclosures']
    }
  }
})
