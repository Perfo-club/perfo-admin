const fs = require('fs');
const { setupStrapi, cleanupStrapi } = require("./helpers/strapi");
require('./cam')
require('./enclosures')

let createSpy;
let originalCreate;

beforeAll(async () => {
  jest.setTimeout(15000)
  const strapi = await setupStrapi();


  global.createdEntities = [];

  // save reference to original `create`
  originalCreate = strapi.entityService.create;

  // create spy for`create` of `strapi.entityService`
  createSpy = jest.spyOn(strapi.entityService, 'create').mockImplementation(async (...args) => {
    
    // call the original method
    const createdEntity = await originalCreate.apply(strapi.entityService, args);

    global.createdEntities.push({
      model: args[0],
      id: createdEntity.id,
    });

    return createdEntity;
  });

});


afterEach(async () => {
  if (global.createdEntities.length) {
    for (const entity of global.createdEntities) {
      await strapi.entityService.delete(entity.model, entity.id);
    }
    // clean created entities
    global.createdEntities = [];
  }
});

afterAll(async () => {
  await cleanupStrapi();
  createSpy.mockRestore();
});

it("strapi is defined", () => {
  expect(strapi).toBeDefined();
});