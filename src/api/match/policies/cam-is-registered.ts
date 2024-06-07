/**
 * cam-is-registered policy
 */
import { Strapi } from "@strapi/strapi";

export default async (policyContext, _, { strapi }: { strapi: Strapi }) => {

  const { camToken } = policyContext.params;

  if(!camToken){
    // console.warn('camToken not set.')
    return false
  }

  const [cam] = await strapi.entityService.findMany("api::cam.cam", {
    filters: {
      token: camToken
    }
  })

  if (!cam) {
    // console.warn('no cam found')
    return false
  }

  return true;
};
