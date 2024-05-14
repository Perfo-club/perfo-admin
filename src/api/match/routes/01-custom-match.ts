export default {
  routes: [
    {
      method: 'POST',
      path:'/match/:camToken',
      handler: 'api::match.match.createMatch',
      config: {
        auth: false,
        policies:['cam-is-registered'],
        middlewares: ['api::match.check-wh-is-firmed'],
      }
    }
  ]
}