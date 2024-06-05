const Strapi = require("@strapi/strapi");
const fs = require("fs");

let instance;

async function setupStrapi() {
  if (!instance) {
    const appContext = await Strapi.compile()
    const strapi = await Strapi(appContext).load()
    instance = strapi;
    
    await instance.server.mount();
  }
  return instance;
}

async function cleanupStrapi() {
  //close server to release the db-file
  await strapi.server.httpServer.close();

  // close the connection to the database before deletion
  await strapi.db?.connection?.destroy();
}

module.exports = { setupStrapi, cleanupStrapi };