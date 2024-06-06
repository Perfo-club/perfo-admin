import { Strapi } from "@strapi/strapi";

export const ROL= {
  player: {
    id: 4,
    name:'Player',
    description: "Un jugador puede ver sus estadisticas y armar equipos",
    type: 'player'
  },
  owner: {
    id: 3,
    name: "Owner",
    description: "Rol para los owners, que pueden crear establecimientos y ver que usuarios jugaron en ellos",
    type: 'owner'
  }
}


export async function createBaseRoles(strapi: Strapi) {

  //Overwrite default strapi data
  await strapi.db.connection.raw('TRUNCATE table "up_roles" CASCADE;')
  await strapi.db.connection.raw('TRUNCATE table "up_permissions" CASCADE;')
  await strapi.db.connection.raw('TRUNCATE table "up_permissions_role_links" CASCADE;')

  //Create app roles

  await strapi.db.connection.raw(`INSERT INTO "public"."up_roles" ("id", "name", "description", "type", "created_at", "updated_at", "created_by_id", "updated_by_id") VALUES
  (1, 'Authenticated', 'Default role given to authenticated user.', 'authenticated', '2024-05-08 16:42:18.378', '2024-05-08 16:42:18.378', NULL, NULL),
  (2, 'Public', 'Default role given to unauthenticated user.', 'public', '2024-05-08 16:42:18.381', '2024-05-13 16:25:14.227', NULL, NULL),
  (${ROL.owner.id}, '${ROL.owner.name}', '${ROL.owner.description}', '${ROL.owner.type}', '2024-05-08 18:20:54.529', '2024-06-04 13:52:53.027', NULL, NULL),
  (${ROL.player.id}, '${ROL.player.name}', '${ROL.player.description}', '${ROL.player.type}', '2024-05-08 18:21:24.134', '2024-05-24 16:13:33.769', NULL, NULL);
  `)

  //Create app permissions

  await strapi.db.connection.raw(`INSERT INTO "public"."up_permissions" ("id", "action", "created_at", "updated_at", "created_by_id", "updated_by_id") VALUES
  (1, 'plugin::users-permissions.user.me', '2024-05-08 16:42:18.385', '2024-05-08 16:42:18.385', NULL, NULL),
  (2, 'plugin::users-permissions.auth.changePassword', '2024-05-08 16:42:18.385', '2024-05-08 16:42:18.385', NULL, NULL),
  (3, 'plugin::users-permissions.auth.connect', '2024-05-08 16:42:18.397', '2024-05-08 16:42:18.397', NULL, NULL),
  (4, 'plugin::users-permissions.auth.forgotPassword', '2024-05-08 16:42:18.397', '2024-05-08 16:42:18.397', NULL, NULL),
  (5, 'plugin::users-permissions.auth.resetPassword', '2024-05-08 16:42:18.397', '2024-05-08 16:42:18.397', NULL, NULL),
  (6, 'plugin::users-permissions.auth.register', '2024-05-08 16:42:18.397', '2024-05-08 16:42:18.397', NULL, NULL),
  (7, 'plugin::users-permissions.auth.emailConfirmation', '2024-05-08 16:42:18.397', '2024-05-08 16:42:18.397', NULL, NULL),
  (8, 'plugin::users-permissions.auth.callback', '2024-05-08 16:42:18.397', '2024-05-08 16:42:18.397', NULL, NULL),
  (9, 'plugin::users-permissions.auth.sendEmailConfirmation', '2024-05-08 16:42:18.397', '2024-05-08 16:42:18.397', NULL, NULL),
  (10, 'api::enclosure.enclosure.find', '2024-05-08 18:20:54.532', '2024-05-08 18:20:54.532', NULL, NULL),
  (11, 'api::enclosure.enclosure.findOne', '2024-05-08 18:20:54.532', '2024-05-08 18:20:54.532', NULL, NULL),
  (12, 'api::enclosure.enclosure.update', '2024-05-08 18:20:54.532', '2024-05-08 18:20:54.532', NULL, NULL),
  (13, 'api::enclosure.enclosure.create', '2024-05-08 18:20:54.532', '2024-05-08 18:20:54.532', NULL, NULL),
  (14, 'api::enclosure.enclosure.delete', '2024-05-08 18:20:54.532', '2024-05-08 18:20:54.532', NULL, NULL),
  (15, 'api::match.match.find', '2024-05-08 18:20:54.532', '2024-05-08 18:20:54.532', NULL, NULL),
  (16, 'api::match-result.match-result.find', '2024-05-08 18:20:54.532', '2024-05-08 18:20:54.532', NULL, NULL),
  (17, 'api::match-result.match-result.findOne', '2024-05-08 18:20:54.532', '2024-05-08 18:20:54.532', NULL, NULL),
  (20, 'api::match.match.findOne', '2024-05-08 18:20:54.532', '2024-05-08 18:20:54.532', NULL, NULL),
  (21, 'api::team.team.find', '2024-05-08 18:20:54.532', '2024-05-08 18:20:54.532', NULL, NULL),
  (22, 'api::team.team.findOne', '2024-05-08 18:20:54.532', '2024-05-08 18:20:54.532', NULL, NULL),
  (23, 'plugin::email.email.send', '2024-05-08 18:20:54.532', '2024-05-08 18:20:54.532', NULL, NULL),
  (24, 'plugin::upload.content-api.find', '2024-05-08 18:20:54.532', '2024-05-08 18:20:54.532', NULL, NULL),
  (25, 'plugin::upload.content-api.findOne', '2024-05-08 18:20:54.532', '2024-05-08 18:20:54.532', NULL, NULL),
  (26, 'plugin::upload.content-api.destroy', '2024-05-08 18:20:54.532', '2024-05-08 18:20:54.532', NULL, NULL),
  (27, 'plugin::upload.content-api.upload', '2024-05-08 18:20:54.532', '2024-05-08 18:20:54.532', NULL, NULL),
  (28, 'api::match.match.create', '2024-05-08 18:21:34.975', '2024-05-08 18:21:34.975', NULL, NULL),
  (29, 'api::match.match.find', '2024-05-08 18:22:39.586', '2024-05-08 18:22:39.586', NULL, NULL),
  (30, 'api::match.match.findOne', '2024-05-08 18:22:39.586', '2024-05-08 18:22:39.586', NULL, NULL),
  (31, 'api::match-result.match-result.find', '2024-05-08 18:22:39.586', '2024-05-08 18:22:39.586', NULL, NULL),
  (32, 'api::match-result.match-result.findOne', '2024-05-08 18:22:39.586', '2024-05-08 18:22:39.586', NULL, NULL),
  (38, 'api::team.team.find', '2024-05-08 18:22:39.586', '2024-05-08 18:22:39.586', NULL, NULL),
  (39, 'api::team.team.findOne', '2024-05-08 18:22:39.586', '2024-05-08 18:22:39.586', NULL, NULL),
  (40, 'api::team.team.create', '2024-05-08 18:22:39.586', '2024-05-08 18:22:39.586', NULL, NULL),
  (41, 'api::team.team.update', '2024-05-08 18:22:39.586', '2024-05-08 18:22:39.586', NULL, NULL),
  (42, 'plugin::email.email.send', '2024-05-10 15:49:27.433', '2024-05-10 15:49:27.433', NULL, NULL),
  (43, 'plugin::upload.content-api.find', '2024-05-10 15:49:27.433', '2024-05-10 15:49:27.433', NULL, NULL),
  (44, 'plugin::upload.content-api.findOne', '2024-05-10 15:49:27.433', '2024-05-10 15:49:27.433', NULL, NULL),
  (45, 'plugin::upload.content-api.upload', '2024-05-10 15:49:27.433', '2024-05-10 15:49:27.433', NULL, NULL),
  (46, 'api::metric.metric.find', '2024-05-16 15:28:14.81', '2024-05-16 15:28:14.81', NULL, NULL),
  (47, 'api::metric.metric.findOne', '2024-05-16 15:28:14.81', '2024-05-16 15:28:14.81', NULL, NULL),
  (48, 'api::metric-category.metric-category.findOne', '2024-05-16 15:28:14.81', '2024-05-16 15:28:14.81', NULL, NULL),
  (49, 'api::metric-category.metric-category.find', '2024-05-16 15:28:14.81', '2024-05-16 15:28:14.81', NULL, NULL),
  (50, 'api::match.match.assignUser', '2024-05-24 16:13:09.694', '2024-05-24 16:13:09.694', NULL, NULL),
  (51, 'api::cam.cam.find', '2024-05-30 17:06:45.752', '2024-05-30 17:06:45.752', NULL, NULL),
  (52, 'api::cam.cam.findOne', '2024-05-30 17:06:45.752', '2024-05-30 17:06:45.752', NULL, NULL),
  (53, 'api::enclosure.enclosure.getEnclosureClients', '2024-05-30 17:48:52.131', '2024-05-30 17:48:52.131', NULL, NULL),
  (54, 'api::match.match.getMatchesGroupedBy', '2024-06-04 13:52:53.034', '2024-06-04 13:52:53.034', NULL, NULL);
  `)

  //Create permissions-role assignment

  await strapi.db.connection.raw(`INSERT INTO "public"."up_permissions_role_links" ("id", "permission_id", "role_id", "permission_order") VALUES
(1, 2, 1, 1),
(2, 1, 1, 1),
(3, 3, 2, 1),
(4, 8, 2, 1),
(5, 5, 2, 1),
(6, 6, 2, 1),
(7, 9, 2, 1),
(8, 4, 2, 1),
(9, 7, 2, 1),
(10, 10, 3, 1),
(11, 11, 3, 1),
(12, 13, 3, 1),
(13, 14, 3, 1),
(14, 12, 3, 1),
(15, 15, 3, 1),
(16, 16, 3, 2),
(18, 17, 3, 2),
(19, 20, 3, 3),
(21, 21, 3, 3),
(22, 24, 3, 3),
(23, 22, 3, 4),
(24, 25, 3, 4),
(25, 26, 3, 4),
(26, 27, 3, 4),
(27, 23, 3, 4),
(28, 28, 3, 5),
(29, 30, 4, 1),
(30, 29, 4, 1),
(31, 31, 4, 1),
(33, 32, 4, 2),
(37, 39, 4, 3),
(39, 38, 4, 3),
(40, 41, 4, 3),
(41, 40, 4, 3),
(42, 43, 4, 4),
(43, 42, 4, 4),
(44, 44, 4, 4),
(45, 45, 4, 5),
(46, 49, 4, 6),
(47, 48, 4, 6),
(48, 47, 4, 6),
(49, 46, 4, 6),
(50, 50, 4, 7),
(51, 51, 3, 6),
(52, 52, 3, 6),
(53, 53, 3, 7),
(54, 54, 3, 8);
`)

  //modify default role
  await strapi.db.connection.raw(`UPDATE "strapi_core_store_settings" set value='{"unique_email":true,"allow_register":true,"email_confirmation":false,"email_reset_password":null,"email_confirmation_redirection":"","default_role":"player"}' where key='plugin_users-permissions_advanced'`)
  await strapi.db.connection.raw(`UPDATE "strapi_core_store_settings" set value='{"email":{"enabled":true,"icon":"envelope"},"discord":{"enabled":false,"icon":"discord","key":"","secret":"","callback":"api/auth/discord/callback","scope":["identify","email"]},"facebook":{"enabled":false,"icon":"facebook-square","key":"","secret":"","callback":"api/auth/facebook/callback","scope":["email"]},"google":{"enabled":false,"icon":"google","key":"","secret":"","callback":"api/auth/google/callback","scope":["email"]},"github":{"enabled":false,"icon":"github","key":"","secret":"","callback":"api/auth/github/callback","scope":["user","user:email"]},"microsoft":{"enabled":false,"icon":"windows","key":"","secret":"","callback":"api/auth/microsoft/callback","scope":["user.read"]},"twitter":{"enabled":false,"icon":"twitter","key":"","secret":"","callback":"api/auth/twitter/callback"},"instagram":{"enabled":false,"icon":"instagram","key":"","secret":"","callback":"api/auth/instagram/callback","scope":["user_profile"]},"vk":{"enabled":false,"icon":"vk","key":"","secret":"","callback":"api/auth/vk/callback","scope":["email"]},"twitch":{"enabled":false,"icon":"twitch","key":"","secret":"","callback":"api/auth/twitch/callback","scope":["user:read:email"]},"linkedin":{"enabled":false,"icon":"linkedin","key":"","secret":"","callback":"api/auth/linkedin/callback","scope":["r_liteprofile","r_emailaddress"]},"cognito":{"enabled":false,"icon":"aws","key":"","secret":"","subdomain":"my.subdomain.com","callback":"api/auth/cognito/callback","scope":["email","openid","profile"]},"reddit":{"enabled":false,"icon":"reddit","key":"","secret":"","state":true,"callback":"api/auth/reddit/callback","scope":["identity"]},"auth0":{"enabled":false,"icon":"","key":"","secret":"","subdomain":"my-tenant.eu","callback":"api/auth/auth0/callback","scope":["openid","email","profile"]},"cas":{"enabled":false,"icon":"book","key":"","secret":"","callback":"api/auth/cas/callback","scope":["openid email"],"subdomain":"my.subdomain.com/cas"},"patreon":{"enabled":false,"icon":"","key":"","secret":"","callback":"api/auth/patreon/callback","scope":["identity","identity[email]"]},"keycloak":{"enabled":false,"icon":"","key":"","secret":"","subdomain":"myKeycloakProvider.com/realms/myrealm","callback":"api/auth/keycloak/callback","scope":["openid","email","profile"]}}' where key='plugin_users-permissions_grant'`)
}