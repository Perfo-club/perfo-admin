export default () => {
  return async (ctx, next) => {
    ctx.query = { ...ctx.query,filters: { ...ctx.query.filters , owner: { id: ctx.state.user.id } }}
    return next();
  }
}