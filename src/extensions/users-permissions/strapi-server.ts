export default function (plugin) {

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

  plugin.routes['content-api'].routes.push({
    method: 'POST',
    path: '/auth/local/owner',
    handler: 'auth.callback',
    config: {
      auth: false,
      policies: ['check-is-owner']
    }
  })

  const regularLoginRoute = plugin.routes['content-api'].routes.find(r=>{
    return r.path === '/auth/local'
  })
  if(!regularLoginRoute){
    throw new Error("No regular login route found");
  }
  regularLoginRoute.config.policies = ['check-is-player']

  return plugin

}