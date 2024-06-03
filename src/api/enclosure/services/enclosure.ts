/**
 * enclosure service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::enclosure.enclosure',({strapi})=>({
  async find(params) {

    const ctx = strapi.requestContext.get();
    const { user } = ctx.state;

    params.filters = {
      ...params.filters,
      owner: { id: user.id } 
    };

    const response = await super.find(params);
    
    return response

  }
}));
