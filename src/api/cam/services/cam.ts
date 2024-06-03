/**
 * cam service
 */

import { factories } from '@strapi/strapi';
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

export default factories.createCoreService('api::cam.cam', ({ strapi }) => ({
  async find(params) {
    const ctx: CustomContext = strapi.requestContext.get();
    const enclosureList = await strapi.entityService.findMany('api::enclosure.enclosure', {
      filters: {
        owner: ctx.state.user.id
      }
    })
    params.filters={
      ...params.filters,
      enclosure: enclosureList.map(e => e.id)
    }

    const response = await super.find(params);
    return response
  },
})
)