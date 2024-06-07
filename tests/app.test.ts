const fs = require('fs');
const { setupStrapi, cleanupStrapi } = require("./helpers/strapi");
require('./cam')
require('./enclosures')
require('./match')