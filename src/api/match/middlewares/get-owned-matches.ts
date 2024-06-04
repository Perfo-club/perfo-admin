export default function () {
  return async (ctx, next) => {
    if (ctx.state.user.role.name === 'Player') {
      const teams = await strapi.entityService.findMany('api::team.team', {
        filters: {
          users: ctx.state.user.id
        }
      })
      if (teams.length === 0) {
        ctx.body = {
          data: [],
          meta: {
            pagination: {
              page: 1,
              pageSize: 25,
              pageCount: 1,
              total: 0
            }
          }
        }
      }
      const matchesIds = []
      for(const t of teams){
        const match = await strapi.entityService.findMany('api::match.match', {
          filters: {
            teams: {
              id: t.id
            }
          }
        })
        matchesIds.push(...match.map(m => m.id))
      } 

      ctx.query = { ...ctx.query, filters: { ...ctx.query.filters, id: matchesIds } }

      return next()
    }
    if (ctx.state.user.role.name === 'Owner') {
      const enclosures = await strapi.entityService.findMany('api::enclosure.enclosure', {
        filters: {
          owner: ctx.state.user.id
        }
      })
      if (enclosures.length === 0) {
        ctx.body = {
          data: [],
          meta: {
            pagination: {
              page: 1,
              pageSize: 25,
              pageCount: 1,
              total: 0
            }
          }
        }
      }
      ctx.query = { ...ctx.query, filters: { ...ctx.request.filers, enclosure: enclosures.map(e => e.id) } }
      return next()
    }
    return ctx.badRequest('Not valid role')

  }
}