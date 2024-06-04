/**
 * match router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::match.match',{
  config:{
    find: {
      middlewares: ['api::match.get-owned-matches']
    }
  }
});
