/**
 * match controller
 */

// Math.floor(Math.random() * 101); numero random del 0 al 100

import { factories } from '@strapi/strapi'
import { Body } from '../types'
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs'

export default factories.createCoreController('api::match.match', ({ strapi }) => ({
  async createMatch(ctx: any) {
    try {

      //Get the cam instance

      const [cam] = await strapi.entityService.findMany('api::cam.cam', {
        filters: { token: ctx.params.camToken },
        populate: '*'
      })
      if (!cam) {
        ctx.response.status = 400
        ctx.response.message = "Can't find cam."
      }

      //get roles

      const role = await strapi.entityService.findMany('plugin::users-permissions.role', {
        filters: {
          name: 'Player'
        }
      })

      if (!role[0]) {
        ctx.response.status = 400
        ctx.response.message = "Can't find player role."
      }

      await strapi.db.transaction(async ({ trx, rollback, commit }) => {
        try {

          const { data: { teamA, teamB, matchDuration } } = ctx.request.body as Body

          //create player and metrics

          const teamAPlayers = []
          const teamBPlayers = []

          teamA.playerStats.forEach(async (playerMetric) => {
            const user = await strapi.db.query('plugin::users-permissions.user').create({
              data: {
                role: [role[0].id]
              }
            })

            teamAPlayers.push(user.id)
          })

          teamB.playerStats.forEach(async (playerMetric) => {
            const user = await strapi.db.query('plugin::users-permissions.user').create({
              data: {
                role: [role[0].id]
              }
            })

            teamBPlayers.push(user.id)

            
          })

          //create teams

          const persistedTeamA = await strapi.service('api::team.team').create(
            {
              data: {
                users: teamAPlayers
              }
            })


          const persistedTeamB = await strapi.service('api::team.team').create(
            {
              data: {
                users: teamBPlayers
              }
            })

          //create Match

          strapi.service('api::match.match').create({
            data: {
              date: dayjs().format(),
              duration: matchDuration,
              teams: [persistedTeamA.id, persistedTeamB.id],
              match_token: uuidv4(),
              enclosure: cam.enclosure.id
            }
          })

          await commit()
          ctx.status = 200
          ctx.message = "Match and metrics saved."
        }
        catch (e) {
          await rollback()
          console.log(e)
          ctx.status = 400
          ctx.message = `An error ocurred all operations reverted. ${e.toString()}`

        }
      })


    } catch (e) {
      ctx.status = 400
      ctx.message = e.toString()
    }
  }
}))
