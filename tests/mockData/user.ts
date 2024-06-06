import { ROL } from "../helpers/roles"

export const PLAYER_DATA = {
  username: 'Random',
  email: 'player@yopmail.com',
  password: 'pass123123', //pass123123 $2a$10$htZ3INiLJ7KYjQ3QsPxnqeFTF91JYiFhx3O6sCyUALfarU8euHJx.
  onboarded: true,
  role:{
    id: ROL.player.id
  }
}

export const ONBOARDED_OWNER_DATA = {
  username: 'Owner',
  email: 'owner@yopmail.com',
  password: 'pass123123', //pass123123 $2a$10$iPNUic4U9BPr.Gnrp7xMIuL4BFc1l.GKSQa.R39Snmbdis.7TWGSC
  onboarded: true,
  role:{
    id: ROL.owner.id
  }
}

export const NEW_OWNER = {
  username: 'New Owner',
  email: 'new-owner@yopmail.com',
  password: 'pass123123', //pass123123 $2a$10$iseag3lRB2NcjizFQKJqYOWyOMMRyNGN3bqZPGueZPPcC9Lut0NaK
  onboarded: false,
  role:{
    id: ROL.owner.id
  }
}