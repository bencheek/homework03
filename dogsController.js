'use strict'

const validator = require('./validator')
const dogSchema = require('./schema/dog.json')
const dogsArray = require('./data/dogs')

const dogsController = {

  list: ctx => { ctx.body = dogsArray },

  create: ctx => {
    const newDog = ctx.request.body
    const result = validator.validate(newDog, dogSchema)
    ctx.assert(result.valid, 400, `Validation failed :${result.errors.map(error => error.message)}`)

    const existingDog = dogsArray.find(dog => dog.id === newDog.id)
    ctx.assert(!existingDog, 409, `Dog with id ${newDog.id} already exists`)

    dogsArray.push(newDog)
    ctx.body = dogsArray
  },

  read: ctx => {
    const dogToShow = dogsArray.find(dog => dog.id === Number(ctx.params.id))
    ctx.assert(dogToShow, 404, `Dog with id ${ctx.params.id} not found`)
    ctx.body = dogToShow
  },

  update: ctx => {
    const dogIndex = dogsArray.findIndex(dog => dog.id === Number(ctx.params.id))
    ctx.assert(dogIndex >= 0, 404, `Dog with id ${ctx.params.id} not found`)

    const updatedDog = ctx.request.body
    const result = validator.validate(updatedDog, dogSchema)

    ctx.assert(result.valid, 400, `Validation failed :${result.errors.map(error => error.message)}`)

    dogsArray[dogIndex] = ctx.request.body
    ctx.body = dogsArray
  },

  delete: ctx => {
    const dogIndex = dogsArray.findIndex(dog => dog.id === Number(ctx.params.id))
    ctx.assert(dogIndex >= 0, 404, `Dog with id ${ctx.params.id} not found`)
    dogsArray.splice(dogIndex, 1)
    ctx.body = dogsArray
  },

}

module.exports = dogsController

