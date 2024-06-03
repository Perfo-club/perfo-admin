export default function (plugin) {


  //Routes for login for owners and players


  //Owner:
  plugin.policies['check-is-owner'] = async (ctx) => {
    const { identifier } = ctx.request.body

    const [user] = await strapi.entityService.findMany('plugin::users-permissions.user', {
      filters: {
        email: identifier
      },
      populate: 'role',
    })
    if (!user) {
      console.error("Owner login: Can't find user with that email.")
      return false
    }
    if (user.role.name === 'Owner') {
      return true
    }
    console.error("Login error: Player attempt to login in Owner account")
    return false
  };

  plugin.routes['content-api'].routes.push({
    method: 'POST',
    path: '/auth/local/owner',
    handler: 'auth.callback',
    config: {
      auth: false,
      policies: ['check-is-owner']
    }
  })

  //Player:
  plugin.policies['check-is-player'] = async (ctx) => {
    const { identifier } = ctx.request.body

    const [user] = await strapi.entityService.findMany('plugin::users-permissions.user', {
      filters: {
        email: identifier
      },
      populate: 'role',
    })
    if (!user) {
      console.error("Player login: Can't find user with that email.")
      return false
    }
    if (user.role.name === 'Player') {
      return true
    }
    console.error("Login error: Owner attempt to login in Player account")
    return false
  };
  const regularLoginRoute = plugin.routes['content-api'].routes.find(r => {
    return r.path === '/auth/local'
  })
  if (!regularLoginRoute) {
    throw new Error("No regular login route found");
  }
  regularLoginRoute.config.policies = ['check-is-player']

  //-----


  //Routes for sign up for owners and players (default is Player)

  const defaultRegisterFn = plugin.controllers.auth.register

  //Owner: 

  plugin.controllers.auth['owner-register'] = async (ctx) => {
    //default register as Owner role (on settings)

    if (!ctx.request.body.enclosure_name) {
      return ctx.badRequest('Missing enclosure name.')
    }
    if (!ctx.request.body.phone) {
      return ctx.badRequest("Missing phone.")
    }

    if (ctx.request.body.phone.length < 6) {
      return ctx.badRequest("Phone too short.")
    }

    await defaultRegisterFn(ctx)

    //change user role

    const role = await strapi.entityService.findMany('plugin::users-permissions.role', {
      filters: {
        name: 'Owner'
      }
    })

    if (!role[0]) {
      return ctx.badRequest("Can't find Owner role.")
    }

    const user = await strapi.entityService.findMany('plugin::users-permissions.user', {
      filters: {
        email: ctx.request.body.email
      }
    })
    await strapi.entityService.update('plugin::users-permissions.user', user[0].id, {
      data: {
        role: role[0]
      }
    })

    //create enclosure 
    await strapi.entityService.create('api::enclosure.enclosure', {
      data: {
        name: ctx.request.body.enclosure_name,
        owner: user[0]
      }
    })
  }

  plugin.routes['content-api'].routes.push({
    method: 'POST',
    path: '/auth/local/register/owner',
    handler: 'auth.owner-register',
    config: {
      auth: false,
    }
  })



  //Player: default



  return plugin

}