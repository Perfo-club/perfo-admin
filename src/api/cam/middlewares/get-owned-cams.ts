export default () => {
  return async (ctx, next) => {

    const enclosureList = await strapi.entityService.findMany('api::enclosure.enclosure', {
      filters: {
        owner: ctx.state.user.id
      }
    })
    ctx.query = { ...ctx.query,filters: { ...ctx.query.filters ,enclosure: enclosureList.map(e => e.id) }}

    return next();
  }
}