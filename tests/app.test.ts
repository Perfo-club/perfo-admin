const fs = require('fs');
const { setupStrapi, cleanupStrapi } = require("./helpers/strapi");
require('./cam')

beforeAll(async () => {
  jest.setTimeout(15000)
  await setupStrapi();
});

afterAll(async () => {
  await cleanupStrapi();
});

it("strapi is defined", () => {
  expect(strapi).toBeDefined();
});