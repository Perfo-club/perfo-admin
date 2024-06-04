/**
 * cam router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::cam.cam',{
  config:{
    find:{
      middlewares: ['api::cam.get-owned-cams']
    }
  }
});
