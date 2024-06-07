/**
 * match controller
 */

// Math.floor(Math.random() * 101); numero random del 0 al 100

import { factories } from '@strapi/strapi'
import { Body, FormatBasedOnGroupBy, GroupByOptions } from '../types'
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs'
require('dayjs/locale/es-mx')
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(localizedFormat)
dayjs.locale('es-mx')

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
          let playerPosition = 1

          for (const _ of teamA.playerMetrics) {
            const user = await strapi.db.query('plugin::users-permissions.user').create({
              data: {
                role: [role[0].id],
                player_match_position: `player-${playerPosition}`
              }
            })
            teamAPlayers.push(user.id)
            playerPosition++
          }

          for (const _ of teamB.playerMetrics) {
            const user = await strapi.db.query('plugin::users-permissions.user').create({
              data: {
                role: [role[0].id],
                player_match_position: `player-${playerPosition}`
              }
            })
            teamBPlayers.push(user.id)
            playerPosition++
          }


          //create teams

          const persistedTeamA = await strapi.service('api::team.team').create(
            {
              data: {
                name: `Equipo A de ${dayjs().format('LLL')}`,
                users: teamAPlayers
              }
            })


          const persistedTeamB = await strapi.service('api::team.team').create(
            {
              data: {
                name: `Equipo B de ${dayjs().format('LLL')}`,
                users: teamBPlayers
              }
            })

          //create Match

          const matchInstance = await strapi.service('api::match.match').create({
            data: {
              date: dayjs().format(),
              duration: matchDuration,
              teams: [persistedTeamA.id, persistedTeamB.id],
              match_token: uuidv4(),
              enclosure: cam.enclosure.id
            }
          })

          //Update enclosure match

          const enclosureIns = await strapi.entityService.findOne('api::enclosure.enclosure', cam.enclosure.id, { populate: 'matches' })

          await strapi.entityService.update('api::enclosure.enclosure', enclosureIns.id, {
            data: {
              matches: [...enclosureIns.matches, matchInstance.id]
            }
          })

          //create player metrics

          const metricPromises = [];

          teamAPlayers.forEach(async (playerId, index) => {
            Object.keys(teamA.playerMetrics[index]).forEach((key) => {
              const metricPromise = (async () => {
                const playerMetricInstance = await strapi.entityService.findMany('api::metric.metric', {
                  filters: {
                    slug: key
                  }
                })
               const metricIns = await strapi.entityService.create('api::user-metric.user-metric', {
                  data: {
                    metric: playerMetricInstance[0],
                    match: matchInstance.id,
                    user: playerId,
                    amount: teamA.playerMetrics[index][key]
                  },
                })
                await strapi.entityService.update('plugin::users-permissions.user', playerId, {
                  data: {
                    metrics: {
                      connect: [metricIns.id],
                    },
                  },
                });

              })();
              metricPromises.push(metricPromise)
            })
          })

          teamBPlayers.forEach((playerId, index) => {
            Object.keys(teamB.playerMetrics[index]).forEach(async (key) => {
              const metricPromise = (async () => {
                const playerMetricInstance = await strapi.entityService.findMany('api::metric.metric', {
                  filters: {
                    slug: key
                  }
                })
                const metricIns = await strapi.entityService.create('api::user-metric.user-metric', {
                  data: {
                    metric: playerMetricInstance[0],
                    match: matchInstance.id,
                    user: playerId,
                    amount: teamB.playerMetrics[index][key]
                  }
                })
                await strapi.entityService.update('plugin::users-permissions.user', playerId, {
                  data: {
                    metrics: {
                      connect: [metricIns.id],
                    },
                  },
                });
              })();
              metricPromises.push(metricPromise)
            })
          })

          await Promise.all(metricPromises)
          await commit()
          ctx.send({
            message: "Match and metrics saved.",
            match: matchInstance.match_token
          })
        }
        catch (e) {
          await rollback()
          console.log('Error!!', e)
          ctx.status = 400
          ctx.message = `An error ocurred all operations reverted. ${e.toString()}`

        }
      })


    } catch (e) {
      ctx.status = 400
      ctx.message = e.toString()
    }
  },
  async assignUser(ctx, next) {
    //search autogenerated player metrics
    await strapi.db.transaction(async ({ trx, rollback, commit }) => {

      try {
        const playerMetricInstances = await strapi.entityService.findMany('api::user-metric.user-metric', {
          filters: {
            user: ctx.state.autogeneratedUserInstance.id
          }
        })

        //assign player metrics to real player
        for (const playerMet of playerMetricInstances) {
          await strapi.entityService.update('api::user-metric.user-metric', playerMet.id, {
            data: {
              user: ctx.state.user.id
            }
          })
        }

        await strapi.entityService.update('plugin::users-permissions.user', ctx.state.user.id, {
          data: {
            metrics: {
              connect: playerMetricInstances
            },
          },
        });

        //replace real player on team
        const team = ctx.state.autogeneratedUserInstance.team
        await strapi.entityService.update('api::team.team', team.id, {
          data: {
            users: [...team.users, ctx.state.user.id]
          }
        })

        //delete autogenerated player
        await strapi.entityService.delete('plugin::users-permissions.user', ctx.state.autogeneratedUserInstance.id)

        await commit()



        ctx.status = 200
        ctx.message = "Match, team and metrics assigned to user"


        //check if team is not duplicated (same players)
        await strapi.controller('api::team.team').mergeDuplicateTeams(ctx, next)

      } catch (e) {

        console.error(e)
        await rollback()

        ctx.status = 400
        ctx.message = e.toString()
      }

    })

  },
  async getMatchesGroupedBy(ctx: any, next) {
    if (!GroupByOptions.some(gb => gb === ctx.params.groupBy)) {
      ctx.badRequest('Invalid group by')
    }
    const matches = await strapi.entityService.findMany('api::match.match', {
      filters: {
        enclosure: ctx.query.filters.enclosure
      }
    })

    const subquery = strapi.db.connection('matches')
      .select(
        strapi.db.connection.raw("date_trunc('month', created_at) AS created_at"),
        strapi.db.connection.raw('COUNT(*) AS matches_count')
      )
      .whereIn('id', matches.map(m => m.id))
      .groupByRaw("date_trunc('month', created_at)");

    const data = await strapi.db.connection
      .select(`created_at as ${ctx.params.groupBy}`)
      .sum('matches_count as Partidos')
      .from(subquery.as('subquery'))
      .groupBy('created_at')
      .orderBy(ctx.params.groupBy);


    const formatedData = data.map(row => {
      const str = dayjs(row.month).format(FormatBasedOnGroupBy[ctx.params.groupBy])
      return {
        ...row,
        [ctx.params.groupBy]:  str.charAt(0).toUpperCase() + str.slice(1)
      }
    })

    return formatedData

  }
}))
