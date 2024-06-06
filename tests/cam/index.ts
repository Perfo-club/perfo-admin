import request from 'supertest'
import useUser from '../helpers/users'
import { ONBOARDED_OWNER_DATA, PLAYER_DATA } from '../mockData/user'

describe('Cam tests', () => {
  describe('When the user has role Owner', () => {
    it('should only get the cams of enclosures he have', async () => {
      const camUserName = 'La cam'
      const camOtherUserName = 'La cam user-2'
      const { jwt, user } = await useUser(ONBOARDED_OWNER_DATA)
      const { jwt: jwtOtherUser, user: otherUserIns } = await useUser({ ...ONBOARDED_OWNER_DATA, id: undefined, email: 'user2@yopmail.com', username: 'user2' })

      const enclosureIns = await strapi.entityService.create('api::enclosure.enclosure', {
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
          name: camUserName,
          token: 'cam',
          enclosure: {
            id: enclosureIns.id
          }
        }
      })

      const enclosureOtherUser = await strapi.entityService.create('api::enclosure.enclosure', {
        data: {
          name: 'User 2 enclosure',
          address: 'Los tilos 1122',
          owner: {
            id: otherUserIns.id,
          }
        }
      })

      await strapi.entityService.create('api::cam.cam', {
        data: {
          name: camOtherUserName,
          token: 'cam-u-2',
          enclosure: {
            id: enclosureOtherUser.id
          }
        }
      })

      await request(strapi.server.httpServer)
        .get('/api/cams')
        .set('accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${jwt}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(data => {
          expect(data.body).toBeDefined()
          expect(data.body.data).toHaveLength(1)
          expect(data.body.data[0].attributes.name).toBe(camUserName)
        })

      await request(strapi.server.httpServer)
        .get('/api/cams')
        .set('accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${jwtOtherUser}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(data => {
          expect(data.body).toBeDefined()
          expect(data.body.data).toHaveLength(1)
          expect(data.body.data[0].attributes.name).toBe(camOtherUserName)
        })



    })
  })
  describe('When the user has role Player', () => {
    it('should not get info of cams', async()=>{
      const { jwt} = await useUser(PLAYER_DATA)

      await request(strapi.server.httpServer)
      .get('/api/cams')
      .set('accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${jwt}`)
      .expect('Content-Type', /json/)
      .expect(403)
    })
  })
})