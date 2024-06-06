import request from 'supertest'
import useUser from '../helpers/useUser'
import { ONBOARDED_OWNER_DATA, PLAYER_DATA } from '../mockData/user'

describe('Cam tests', () => {
  describe('When the user has role Owner', () => {
    it('should get the cams of enclosures he have', async () => {
      const { jwt, userIns } = await useUser(ONBOARDED_OWNER_DATA)

      const enclosureIns = await strapi.entityService.create('api::enclosure.enclosure', {
        data: {
          name: 'Test enclosure',
          address: 'Los tilas 1122',
          owner: {
            id: userIns.id,
          }
        }
      })
      await strapi.entityService.create('api::cam.cam', {
        data: {
          name: 'La cam',
          token: 'cam',
          enclosure: {
            id: enclosureIns.id
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
        })
      
    })
    it.todo('should not get cams of other enclosures')
  })
  describe('When the user has role Player', () => {
    it.todo('should not get info of cams')
  })
})