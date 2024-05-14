/**
 * cam-is-registered policy
 */
import { Strapi } from "@strapi/strapi";

export default async (policyContext, _, { strapi }: { strapi: Strapi }) => {

  const { camToken } = policyContext.params;

  if(!camToken){
    return false
  }

  const [cam] = await strapi.entityService.findMany("api::cam.cam", {
    filters: {
      token: camToken
    }
  })

  if (!cam) {
    return false
  }

  return true;
};
