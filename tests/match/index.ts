import { ID } from '@strapi/types/dist/types/core/entity'
import request from 'supertest'
import useUser from "../helpers/users"
import { ONBOARDED_OWNER_DATA, PLAYER_DATA } from "../mockData/user"
import { webhookBody } from './webhookData'

const camToken = 'test-cam-webhook'

async function triggerWebhook(enclosureId?: ID) {
  const { user } = await useUser(ONBOARDED_OWNER_DATA)

  let enclosureIns

  if (!enclosureId) {
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
  } else {
    enclosureIns = await strapi.entityService.findOne('api::enclosure.enclosure', enclosureId)
  }

  let webhookResponse

  await request(strapi.server.httpServer)
    .post(`/api/match/${camToken}`)
    .set('accept', 'application/json')
    .set('Content-Type', 'application/json')
    .set('x-perfo-signature', 'EOrA0MVdnsYM5LLin/2omS9Tgb+OlaKnFiG95K3/hFI=')
    .send(webhookBody)
    .expect(200)
    .then(data => {
      expect(data.body).toBeDefined()
      webhookResponse = data.body
    })

  return { enclosureIns, webhookResponse }
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

        const usersCreated = await strapi.entityService.findMany('plugin::users-permissions.user', {
          filters: {
            player_match_position: {
              $not: null
            }
          }
        })

        expect(usersCreated).toHaveLength(4)

      })
      it('each user should have the player-x slug', async () => {
        await triggerWebhook()

        const usersCreated = await strapi.entityService.findMany('plugin::users-permissions.user', {
          filters: {
            player_match_position: {
              $not: null
            }
          }
        })

        usersCreated.forEach((user, index) => {
          expect(user).toHaveProperty('player_match_position', `player-${index + 1}`)
        })
      })
      it('it should create 2 teams', async () => {

        await triggerWebhook()

        const teamsCreated = await strapi.entityService.findMany('api::team.team')

        expect(teamsCreated).toHaveLength(2)

      })
      it('each team should have 2 players', async () => {
        await triggerWebhook()

        const teamsCreated = await strapi.entityService.findMany('api::team.team', {
          populate: 'users'
        })

        teamsCreated.forEach(team => {
          expect(team.users).toHaveLength(2)
        })

      })
      it('each player should have 22 metrics assigned', async () => {

        await triggerWebhook()
        const usersCreated = await strapi.entityService.findMany('plugin::users-permissions.user', {
          populate: 'metrics',
          filters: {
            player_match_position: {
              $not: null
            }
          }
        })
        usersCreated.forEach((user) => {
          expect(user.metrics).toHaveLength(22)
        })

      })
      it('the enclosure should have one more match assigned', async () => {
        const { enclosureIns } = await triggerWebhook()

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
  describe('Match assign (assign user to auto-generated account)', () => {
    describe('when a user claim for an auto-generated account', () => {
      it('the auto-generated account should be deleted', async () => {
        const playerSlug = 'player-1'

        const { jwt } = await useUser(PLAYER_DATA)
        const { webhookResponse } = await triggerWebhook()

        await request(strapi.server.httpServer)
          .post(`/api/match/assign/${webhookResponse.match}/${playerSlug}`)
          .set('Authorization', `Bearer ${jwt}`)
          .expect(200)

        const player = await strapi.entityService.findMany('plugin::users-permissions.user', {
          filters: {
            player_match_position: playerSlug
          }
        })

        expect(player).toHaveLength(0)

      })
      it('the metrics should be re-assigned to the user', async () => {
        const playerSlug = 'player-1'

        const { jwt, user } = await useUser(PLAYER_DATA)
        const { webhookResponse } = await triggerWebhook()

        await request(strapi.server.httpServer)
          .post(`/api/match/assign/${webhookResponse.match}/${playerSlug}`)
          .set('Authorization', `Bearer ${jwt}`)
          .expect(200)


        const userIns = await strapi.entityService.findOne('plugin::users-permissions.user', user.id, {
          populate: 'metrics'
        })

        expect(userIns.metrics).toHaveLength(22)
      })
      it('the metrics should be added, not replaced', async () => {
        const playerSlug = 'player-1'
        const playerSlugSecondMatch = 'player-4'

        const { jwt, user } = await useUser(PLAYER_DATA)
        const { enclosureIns, webhookResponse } = await triggerWebhook()

        await request(strapi.server.httpServer)
          .post(`/api/match/assign/${webhookResponse.match}/${playerSlug}`)
          .set('Authorization', `Bearer ${jwt}`)
          .expect(200)

        const { webhookResponse: secondMatch } = await triggerWebhook(enclosureIns.id)

        await request(strapi.server.httpServer)
          .post(`/api/match/assign/${secondMatch.match}/${playerSlugSecondMatch}`)
          .set('Authorization', `Bearer ${jwt}`)
          .expect(200)


        const userIns = await strapi.entityService.findOne('plugin::users-permissions.user', user.id, {
          populate: 'metrics'
        })

        expect(userIns.metrics).toHaveLength(44)

      })
      describe('if the user already claimed an auto-generated account', () => {
        it('should return an error', async () => {
          const playerSlug = 'player-1'
          const playerSlugCheat = 'player-2'

          const { jwt } = await useUser(PLAYER_DATA)

          const { webhookResponse } = await triggerWebhook()

          await request(strapi.server.httpServer)
            .post(`/api/match/assign/${webhookResponse.match}/${playerSlug}`)
            .set('Authorization', `Bearer ${jwt}`)
            .expect(200)

          await request(strapi.server.httpServer)
            .post(`/api/match/assign/${webhookResponse.match}/${playerSlugCheat}`)
            .set('Authorization', `Bearer ${jwt}`)
            .expect(400)

        })
      })
      describe('if two users play twice on the same team', () => {
        it('the should be only one team', async () => {
          const player1Slug = 'player-1'
          const player2Slug = 'player-2'

          const player1SecondMatchSlug = 'player-3'
          const player2SecondMatchSlug = 'player-4'

          const { jwt: jwtP1 } = await useUser(PLAYER_DATA)
          const { jwt: jwtP2 } = await useUser({ ...PLAYER_DATA, email: 'juan@hotmail.com', username: 'juancito' })

          const { enclosureIns, webhookResponse } = await triggerWebhook()

          await request(strapi.server.httpServer)
            .post(`/api/match/assign/${webhookResponse.match}/${player1Slug}`)
            .set('Authorization', `Bearer ${jwtP1}`)
            .expect(200)

          await request(strapi.server.httpServer)
            .post(`/api/match/assign/${webhookResponse.match}/${player2Slug}`)
            .set('Authorization', `Bearer ${jwtP2}`)
            .expect(200)


          const { webhookResponse: responseSecondMatch } = await triggerWebhook(enclosureIns.id)

          await request(strapi.server.httpServer)
            .post(`/api/match/assign/${responseSecondMatch.match}/${player1SecondMatchSlug}`)
            .set('Authorization', `Bearer ${jwtP1}`)
            .expect(200)

          await request(strapi.server.httpServer)
            .post(`/api/match/assign/${responseSecondMatch.match}/${player2SecondMatchSlug}`)
            .set('Authorization', `Bearer ${jwtP2}`)
            .expect(200)


          const teams = await strapi.entityService.findMany('api::team.team')

          expect(teams).toHaveLength(3)


        })
      })
      describe('if all four players claimed the auto-generated accounts', () => {
        it('there should not be auto-generated accounts left, and only two teams', async () => {
          const player1Slug = 'player-1'
          const player2Slug = 'player-2'
          const player3Slug = 'player-3'
          const player4Slug = 'player-4'

          const { jwt: jwtP1 } = await useUser(PLAYER_DATA)
          const { jwt: jwtP2 } = await useUser({ ...PLAYER_DATA, email: 'raul@hotmail.com', username: 'raul' })
          const { jwt: jwtP3 } = await useUser({ ...PLAYER_DATA, email: 'jorge@hotmail.com', username: 'jorge' })
          const { jwt: jwtP4 } = await useUser({ ...PLAYER_DATA, email: 'juan@hotmail.com', username: 'juancito' })

          const { enclosureIns, webhookResponse } = await triggerWebhook()

          await request(strapi.server.httpServer)
            .post(`/api/match/assign/${webhookResponse.match}/${player1Slug}`)
            .set('Authorization', `Bearer ${jwtP1}`)
            .expect(200)
          await request(strapi.server.httpServer)
            .post(`/api/match/assign/${webhookResponse.match}/${player2Slug}`)
            .set('Authorization', `Bearer ${jwtP2}`)
            .expect(200)
          await request(strapi.server.httpServer)
            .post(`/api/match/assign/${webhookResponse.match}/${player3Slug}`)
            .set('Authorization', `Bearer ${jwtP3}`)
            .expect(200)
          await request(strapi.server.httpServer)
            .post(`/api/match/assign/${webhookResponse.match}/${player4Slug}`)
            .set('Authorization', `Bearer ${jwtP4}`)
            .expect(200)

          const autoGeneratedUser = await strapi.entityService.findMany('plugin::users-permissions.user', {
            filters: {
              player_match_position: {
                $not: null
              }
            }
          })
          const teams = await strapi.entityService.findMany('api::team.team')
          expect(teams).toHaveLength(2)
          expect(autoGeneratedUser).toHaveLength(0)


          const { webhookResponse: secondMatch } = await triggerWebhook(enclosureIns.id)

          await request(strapi.server.httpServer)
            .post(`/api/match/assign/${secondMatch.match}/${player1Slug}`)
            .set('Authorization', `Bearer ${jwtP1}`)
            .expect(200)
          await request(strapi.server.httpServer)
            .post(`/api/match/assign/${secondMatch.match}/${player2Slug}`)
            .set('Authorization', `Bearer ${jwtP2}`)
            .expect(200)
          await request(strapi.server.httpServer)
            .post(`/api/match/assign/${secondMatch.match}/${player3Slug}`)
            .set('Authorization', `Bearer ${jwtP3}`)
            .expect(200)
          await request(strapi.server.httpServer)
            .post(`/api/match/assign/${secondMatch.match}/${player4Slug}`)
            .set('Authorization', `Bearer ${jwtP4}`)
            .expect(200)

          const autoGeneratedUser2 = await strapi.entityService.findMany('plugin::users-permissions.user', {
            filters: {
              player_match_position: {
                $not: null
              }
            }
          })
          const teams2 = await strapi.entityService.findMany('api::team.team')
          expect(teams2).toHaveLength(2)
          expect(autoGeneratedUser2).toHaveLength(0)

        })
      })
    })
  })
})