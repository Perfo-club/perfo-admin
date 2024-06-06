import { Strapi } from "@strapi/strapi";



export default async function ResetUsers(strapi: Strapi) {
  await strapi.db.connection.raw('truncate table "up_users" CASCADE')
}