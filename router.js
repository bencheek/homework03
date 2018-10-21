'use strict'

const Router = require('koa-router')


const router = new Router()
const validator = require('./validator')
const dogSchema = require('./schema/dog.json')
const dogsArray = require('./data/dogs')
const log = require('./logger')

router.get('/', ctx => {
  log.info('GET /')
  ctx.body = 'Dogbook backend server'
})
  .get('/dog', ctx => {
    ctx.body = dogsArray
  })
  .get('/dog/:id', ctx => {
    const dogToShow = dogsArray.find(dog => dog.id === Number(ctx.params.id))

    ctx.assert(dogToShow, 404, `Dog with id ${ctx.params.id} not found`)

    ctx.body = dogToShow
  })
  .post('/dog', ctx => {
    const newDog = ctx.request.body

    const result = validator.validate(newDog, dogSchema)

    ctx.assert(result.valid, 400, 'Validation failed', result.errors)

    const existingDog = dogsArray.find(dog => dog.id === newDog.id)

    ctx.assert(!existingDog, 409, `Dog with id ${newDog.id} already exists`)

    dogsArray.push(newDog)

    ctx.body = dogsArray
  })
  .delete('/dog/:id', ctx => {
    const dogIndex = dogsArray.findIndex(dog => dog.id === Number(ctx.params.id))

    ctx.assert(dogIndex >= 0, 404, `Dog with id ${ctx.params.id} not found`)

    dogsArray.splice(dogIndex, 1)
    ctx.body = dogsArray
  })
  .put('/dog/:id', ctx => {
    const dogIndex = dogsArray.findIndex(dog => dog.id === Number(ctx.params.id))

    ctx.assert(dogIndex >= 0, 404, `Dog with id ${ctx.params.id} not found`)

    const updatedDog = ctx.request.body
    const result = validator.validate(updatedDog, dogSchema)

    ctx.assert(result.valid, 400, 'Validation failed', result.errors)

    dogsArray[dogIndex] = ctx.request.body
    ctx.body = dogsArray
  })

module.exports = {
  router
}
