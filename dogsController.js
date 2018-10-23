'use strict'

const log = require('./logger')
const validator = require('./validator')
const dogsArray = require('./data/dogs')
const createDogSchema = require('./schema/createDog.json')
const updateDogSchema = require('./schema/updateDog.json')

const dogsController = {

  list: ctx => { ctx.body = dogsArray },

  create: ctx => {
    const newDog = ctx.request.body
    const result = validator.validate(newDog, createDogSchema)
    ctx.assert(result.valid, 400, `Validation failed :${result.errors.map(error => error.message)}`)

    const existingDog = dogsArray.find(dog => dog.id === newDog.id)
    ctx.assert(!existingDog, 409, `Dog with id ${newDog.id} already exists`)

    dogsArray.push(newDog)
    ctx.body = dogsArray

    log.info(`Dog with id ${newDog.id} created`)
  },

  read: ctx => {
    const dogId = Number(ctx.params.id) 
    const dogToShow = dogsArray.find(dog => dog.id === dogId)
    ctx.assert(dogToShow, 404, `Dog with id ${dogId} not found`)
    ctx.body = dogToShow
  },

  update: ctx => {
    const dogId = Number(ctx.params.id)
    const dogIndex = dogsArray.findIndex(dog => dog.id === dogId)
    ctx.assert(dogIndex >= 0, 404, `Dog with id ${dogId} not found`)

    const updatedDog = ctx.request.body

    const result = validator.validate(updatedDog, updateDogSchema)
    ctx.assert(result.valid, 400, `Validation failed :${result.errors.map(error => error.message)}`)

    updatedDog.id = dogId
    dogsArray[dogIndex] = updatedDog
    ctx.body = dogsArray

    log.info(`Dog with id ${dogId} updated`)
  },

  delete: ctx => {
    const dogId = Number(ctx.params.id)  
    const dogIndex = dogsArray.findIndex(dog => dog.id === dogId)
    ctx.assert(dogIndex >= 0, 404, `Dog with id ${dogId} not found`)
    dogsArray.splice(dogIndex, 1)
    ctx.body = dogsArray

    log.info(`Dog with id ${dogId} deleted`)
  },

}

module.exports = dogsController

