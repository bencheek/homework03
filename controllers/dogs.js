'use strict'

const log = require('../utils/logger')
const validator = require('../validations/validator')
const dogsOperations = require('../operations/dogs')
const createDogSchema = require('./../validations/schema/createDog.json')
const updateDogSchema = require('./../validations/schema/updateDog.json')

async function list(ctx) {
  ctx.body = await dogsOperations.list()
}

async function read(ctx) {
  const input = {
    id: parseInt(ctx.params.id),
  }

  // TODO: validate.(schemas.dogId, input)

  ctx.body = await dogsOperations.read(input)
}

async function create(ctx) {
  const input = {
    name: ctx.request.body.name,
    breed: ctx.request.body.breed,
    birthYear: parseInt(ctx.request.body.birthYear),
    photo: ctx.request.body.photo,
  }

  const result = validator.validate(input, createDogSchema)
  // TODO : throw app error
  ctx.assert(result.valid, 400, `Validation failed :${result.errors.map(error => error.message)}`)

  const dogs = await dogsOperations.create(input)
  ctx.status = 201
  ctx.body = dogs
  log.info('Dog created')
}

async function update(ctx) {
  const input = {
    id: parseInt(ctx.request.body.id),
    name: ctx.request.body.name,
    breed: ctx.request.body.breed,
    birthYear: parseInt(ctx.request.body.birthYear),
    photo: ctx.request.body.photo,
  }

  const result = validator.validate(input, updateDogSchema)
  ctx.assert(result.valid, 400, `Validation failed :${result.errors.map(error => error.message)}`)

  ctx.status = 200
  ctx.body = await dogsOperations.update(input)
}

async function remove(ctx) {
  const input = {
    id: parseInt(ctx.params.id),
  }
  // TODO : validate id schema

  ctx.status = 200
  ctx.body = await dogsOperations.remove(input)
}


module.exports = {
  list,
  read,
  create,
  update,
  remove,
}

