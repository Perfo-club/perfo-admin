export default () => {
  return async (ctx, next) => {
    if(ctx.state.user.role.name ==='Owner'){
      const enclosureList = await strapi.entityService.findMany('api::enclosure.enclosure', {
        filters: {
          owner: ctx.state.user.id
        }
      })
      if (enclosureList.length === 0) {
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
      ctx.query = { ...ctx.query, filters: { ...ctx.query.filters ,enclosure: enclosureList.map(e => e.id) }}
    }
    return next();
  }
}