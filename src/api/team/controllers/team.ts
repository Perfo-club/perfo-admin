/**
 * team controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::team.team', ({ strapi }) => ({
  async mergeDuplicateTeams(ctx) {
    const teams = await strapi.entityService.findMany('api::team.team',{
      filters:{
        users:  ctx.state.user.id
      },
      populate: 'users'
    })

    let teamsToDelete = []
    const userHashes = {}

    for (const team of teams){
      const usersInTeam = team.users.map(row=>row.id)
      const userHash = usersInTeam.sort().join('-')

      if(userHashes[userHash]){
        teamsToDelete.push(team.id)
      }else{
        userHashes[userHash] = team
      }
    }
    console.log('erasing teams: ', teamsToDelete)
    for (const teamToDelete of teamsToDelete){
      await strapi.entityService.delete('api::team.team', teamToDelete)
    }
}}))
