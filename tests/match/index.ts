import request from 'supertest'
import useUser from "../helpers/users"
import { ONBOARDED_OWNER_DATA } from "../mockData/user"
import { webhookBody } from './webhookData'
import { ID } from '@strapi/types/dist/types/core/entity'

const camToken = 'test-cam-webhook'

async function triggerWebhook (enclosureId?: ID){
  const { user } = await useUser(ONBOARDED_OWNER_DATA)

  let enclosureIns

  if(!enclosureId){
    enclosureIns = await strapi.entityService.create('api::enclosure.enclosure', {
      data: {
        name: 'User 1 enclosure',
        address: 'Los tilos 1122',
        owner: {
          id: user.id,
        }
      }
    })
  
    await strapi.entityService.create('api::cam.cam', {
      data: {
        name: 'wh-test',
        token: camToken,
        enclosure: {
          id: enclosureIns.id
        }
      }
    })
  }else{
    enclosureIns = await strapi.entityService.findOne('api::enclosure.enclosure', enclosureId)
  }

  await request(strapi.server.httpServer)
  .post(`/api/match/${camToken}`)
  .set('accept', 'application/json')
  .set('Content-Type', 'application/json')
  .set('x-perfo-signature', 'EOrA0MVdnsYM5LLin/2omS9Tgb+OlaKnFiG95K3/hFI=')
  .send(webhookBody)
  .expect(200)
  .then(data => {
    expect(data.body).toBeDefined()
  })
  return enclosureIns
}

describe('Match', () => {
  describe('Create match (webhook)', () => {
    describe('when the cam token does not exist', () => {
      it('should not create the match', async () => {
        await request(strapi.server.httpServer)
          .post('/api/match/unexistingCamToken')
          .set('accept', 'application/json')
          .set('Content-Type', 'application/json')
          .set('x-perfo-signature', 'EOrA0MVdnsYM5LLin/2omS9Tgb+OlaKnFiG95K3/hFI=')
          .expect('Content-Type', /json/)
          .expect(403)
      })
    })
    describe('when the cam token is not sent', () => {
      it('should not create the match', async () => {
        await request(strapi.server.httpServer)
          .post('/api/match')
          .set('accept', 'application/json')
          .set('Content-Type', 'application/json')
          .set('x-perfo-signature', 'EOrA0MVdnsYM5LLin/2omS9Tgb+OlaKnFiG95K3/hFI=')
          .expect(405)
      })
    })
    describe('when the signature is not sent', () => {
      it('should not create the match', async () => {
        await strapi.entityService.create('api::cam.cam', {
          data: {
            name: 'wh-test',
            token: camToken,
          }
        })
        await request(strapi.server.httpServer)
          .post(`/api/match/${camToken}`)
          .set('accept', 'application/json')
          .set('Content-Type', 'application/json')
          .expect('Content-Type', /json/)
          .expect(401)
      })
    })
    describe('when match is created', () => {
      it('should create 4 users', async () => {
        await triggerWebhook()

        const usersCreated = await strapi.entityService.findMany('plugin::users-permissions.user',{
          filters:{
            player_match_position: {
              $not: null
            }
          }
        })

        expect(usersCreated).toHaveLength(4)

      })
      it('each user should have the player-x slug',async ()=>{
        await triggerWebhook()

        const usersCreated = await strapi.entityService.findMany('plugin::users-permissions.user',{
          filters:{
            player_match_position: {
              $not: null
            }
          }
        })

        usersCreated.forEach((user,index)=>{
          expect(user).toHaveProperty('player_match_position', `player-${index + 1}`)
        })
      })
      it('it should create 2 teams', async()=>{

        await triggerWebhook()

        const teamsCreated = await strapi.entityService.findMany('api::team.team')

        expect(teamsCreated).toHaveLength(2)

      })
      it('each team should have 2 players',async()=>{
        await triggerWebhook()

        const teamsCreated = await strapi.entityService.findMany('api::team.team',{
          populate:'users'
        })

        teamsCreated.forEach(team=>{
          expect(team.users).toHaveLength(2)
        })

      })
      it('each player should have 22 metrics assigned', async()=>{

        await triggerWebhook()
        const usersCreated = await strapi.entityService.findMany('plugin::users-permissions.user',{
          populate:'metrics',
          filters:{
            player_match_position: {
              $not: null
            }
          }
        })
        usersCreated.forEach((user)=>{
          expect(user.metrics).toHaveLength(22)
        })

      })
      it('the enclosure should have one more match assigned', async()=>{
        const enclosureIns = await triggerWebhook()

        const updatedEnclosure = await strapi.entityService.findOne('api::enclosure.enclosure', enclosureIns.id, {
          populate: 'matches'
        })

        expect(updatedEnclosure.matches).toHaveLength(1)

        await triggerWebhook(enclosureIns.id)
        
        const sameEnclosure = await strapi.entityService.findOne('api::enclosure.enclosure', enclosureIns.id, {
          populate: 'matches'
        })

        expect(sameEnclosure.matches).toHaveLength(2)
      })

    })
  })
})