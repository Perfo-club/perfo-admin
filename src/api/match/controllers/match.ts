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

          //create team metrics

          const metricsTeamA = await strapi.entityService.create('api::team-metric.team-metric', {
            data: {
              attack_time: teamA.teamStats.attack_time,
              defense_time: teamA.teamStats.defense_time
            }
          })

          const metricsTeamB = await strapi.entityService.create('api::team-metric.team-metric', {
            data: {
              attack_time: teamB.teamStats.attack_time,
              defense_time: teamB.teamStats.defense_time
            }
          })


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

            await strapi.service('api::player-metric.player-metric').create({
              data: {
                good_serves_percentage: playerMetric.good_serves_percentage,
                ace_percentage: playerMetric.ace_percentage,
                second_good_serves_percentage: playerMetric.second_good_serves_percentage,
                net_points_percentage: playerMetric.net_points_percentage,
                average_reaction_time: playerMetric.average_reaction_time,
                save_return_efficiency_percentage: playerMetric.save_return_efficiency_percentage,
                user: user.id,
              }
            })
          })

          teamB.playerStats.forEach(async (playerMetric) => {
            const user = await strapi.db.query('plugin::users-permissions.user').create({
              data: {
                role: [role[0].id]
              }
            })

            teamBPlayers.push(user.id)

            await strapi.service('api::player-metric.player-metric').create({
              data: {
                good_serves_percentage: playerMetric.good_serves_percentage,
                ace_percentage: playerMetric.ace_percentage,
                second_good_serves_percentage: playerMetric.second_good_serves_percentage,
                net_points_percentage: playerMetric.net_points_percentage,
                average_reaction_time: playerMetric.average_reaction_time,
                save_return_efficiency_percentage: playerMetric.save_return_efficiency_percentage,
                user: user.id,
              }
            })
          })

          //create teams

          const persistedTeamA = await strapi.service('api::team.team').create(
            {
              data: {
                users: teamAPlayers,
                metrics: metricsTeamA.id
              }
            })


          const persistedTeamB = await strapi.service('api::team.team').create(
            {
              data: {
                users: teamBPlayers,
                metrics: metricsTeamB.id
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
