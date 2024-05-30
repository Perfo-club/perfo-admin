export default {
  routes: [
    {
      method: 'GET',
      path: '/clients',
      handler: 'api::enclosure.enclosure.getEnclosureClients',
    },
  ]
}