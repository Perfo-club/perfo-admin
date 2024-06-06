import request from 'supertest'
import useUser from "../helpers/users"
import { ONBOARDED_OWNER_DATA } from "../mockData/user"

describe('Enclosures', () => {
  describe('When user has role owner', () => {
    it('it should only get the enclosures it created', async () => {
      const enclosureName = 'User 1 enclosure';
      const otherEnclosureName = 'User 2 enclosure'

      const { jwt, user } = await useUser(ONBOARDED_OWNER_DATA)
      const { jwt: jwtOtherUser, user: otherUserIns } = await useUser({ ...ONBOARDED_OWNER_DATA, id: undefined, email: 'user2@yopmail.com', username: 'user2' })

      await strapi.entityService.create('api::enclosure.enclosure', {
        data: {
          name: enclosureName,
          address: 'Los tilos 1122',
          owner: {
            id: user.id,
          }
        }
      })
      await strapi.entityService.create('api::enclosure.enclosure', {
        data: {
          name: otherEnclosureName,
          address: 'Los tilos 1122',
          owner: {
            id: otherUserIns.id,
          }
        }
      })

      await request(strapi.server.httpServer)
        .get('/api/enclosures')
        .set('accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${jwt}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(data => {
          expect(data.body).toBeDefined()
          expect(data.body.data).toHaveLength(1)
          expect(data.body.data[0].attributes.name).toBe(enclosureName)
        })

      await request(strapi.server.httpServer)
        .get('/api/enclosures')
        .set('accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${jwtOtherUser}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(data => {
          expect(data.body).toBeDefined()
          expect(data.body.data).toHaveLength(1)
          expect(data.body.data[0].attributes.name).toBe(otherEnclosureName)
        })
    })
  })
})