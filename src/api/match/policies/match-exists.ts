import { Strapi } from "@strapi/strapi";

export default async (policyContext, _, { strapi }: { strapi: Strapi }) => {

  const { matchToken } = policyContext.params;

  if(!matchToken){
    console.warn('matchToken not set')
    return false
  }

  const [match] = await strapi.entityService.findMany("api::match.match", {
    filters: {
      match_token: matchToken
    }
  })

  if (!match) {
    console.warn('no match found')
    return false
  }

  return true;
};
