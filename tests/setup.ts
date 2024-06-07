import { cleanupStrapi, setupStrapi } from "./helpers/strapi";

let createSpy;
let originalDbQueryUserSpy;
let originalCreate;
let strapi
let originalDbQueryUserCreate

beforeAll(async () => {
  jest.setTimeout(15000)
  let strapi = await setupStrapi();


  global.createdEntities = [];

  // save reference to original `create`
  originalCreate = strapi.entityService.create;

  originalDbQueryUserCreate = strapi.db.query('plugin::users-permissions.user').create

  // create spy for`create` of `strapi.entityService`

  originalDbQueryUserSpy=  jest.spyOn(strapi.db.query('plugin::users-permissions.user'), 'create').mockImplementation(async (...args) => {
    
    // call the original method

    const createdEntity = await originalDbQueryUserCreate(args[0]);

    global.createdEntities.push({
      model: 'plugin::users-permissions.user',
      id: createdEntity.id,
    });


    return createdEntity;
  });

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
      if(!strapi){
        strapi = await setupStrapi()
      }
      await strapi.entityService.delete(entity.model, entity.id);
    }
    // clean created entities
    global.createdEntities = [];
  }
});

afterAll(async () => {
  await cleanupStrapi();
  createSpy.mockRestore();
  originalDbQueryUserSpy.mockRestore();
});