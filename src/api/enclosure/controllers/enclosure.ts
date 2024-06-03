/**
 * enclosure controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::enclosure.enclosure', ({ strapi }) => ({
  async getEnclosureClients(ctx: any) {
    const enclosures = await strapi.entityService.findMany("api::enclosure.enclosure", {
      filters: {
        owner: ctx.state.user.id
      },
      populate: {
        matches: {
          populate: {
            teams: {
              populate: 'users'
            }
          }
        }
      },
    })

    let usersCount = 0

    enclosures.forEach((e) => {
      e.matches.forEach(m => {
        m.teams.forEach(t => {
          usersCount = usersCount + t.users.length
        })
      })
    })

    return usersCount
  },
})
)
