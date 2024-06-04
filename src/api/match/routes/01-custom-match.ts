
export default {
  routes: [
    {method: 'GET',
      path: '/matches/:groupBy',
      handler:'api::match.match.getMatchesGroupedBy',
      config:{
        middlewares:['api::match.get-owned-matches']
      }
    },
    {
      method: 'POST',
      path: '/match/assign/:matchToken/:playerMatchPosition',
      handler: 'api::match.match.assignUser',
      config: {
        policies: ['match-exists', 'player-param-exists'],
        middlewares: [
          'api::match.get-match-instance',
          'api::match.get-autogenerated-user-instance'
        ]
      }
    },
    {
      method: 'POST',
      path: '/match/:camToken',
      handler: 'api::match.match.createMatch',
      config: {
        auth: false,
        policies: ['cam-is-registered'],
        middlewares: ['api::match.check-wh-is-firmed'],
      }
    }
  ]
}