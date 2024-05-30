/**
 * cam controller
 */

import { factories } from '@strapi/strapi'
import { Context } from 'koa';

interface CustomQuery {
  [key: string]: any;
  filters?: {
    [key: string]: any;
  };
}

interface CustomContext extends Context {
  query: CustomQuery;
}

export default factories.createCoreController('api::cam.cam',({strapi})=>({
  async find(ctx: CustomContext){

    const enclosureList = await strapi.entityService.findMany('api::enclosure.enclosure',{
      filters:{
        owner: ctx.state.user.id
      }
    })

    ctx.query = { ...ctx.query, filters: { enclosure: enclosureList.map(e=>e.id) } };

    const response = await super.find(ctx);
    
    return response
  },
}
))
