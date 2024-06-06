import request from 'supertest'
import { ROL } from './roles'

export type UserType = {
  id: number
  username: string
  email: string
  password: string
  onboarded: boolean
  role:{
    id: number
  }
}


export default async function useUser(user: UserType){

  let userIns =  await strapi.entityService.findOne('plugin::users-permissions.user', user.id)

  if(!userIns){
    userIns = await strapi.plugins["users-permissions"].services.user.add({
      ...user,
      provider: 'local',
    });
  }

  const response = await request(strapi.server.httpServer)
  .post(user.role.id === ROL.player.id ? "/api/auth/local": "/api/users-permissions/auth/local/owner")
  .set("accept", "application/json")
  .set("Content-Type", "application/json")
  .send({
    identifier: user.email,
    password: user.password,
  })
  .expect("Content-Type", /json/)
  .expect(200)
  .catch(e=>{
    console.log(e.message)
  })

  return {
    jwt: response.body.jwt,
    userIns
  }
}