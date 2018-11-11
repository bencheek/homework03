'use strict'

const log = require('../utils/logger')
const validator = require('../validations/validator')
const dogsOperations = require('../operations/dogs')
const schema = require('./../validations/schema/dogs')


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
    userId: ctx.state.user.id,
  }

  validator.validate(schema.createDog, input)

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

  validator.validate(schema.updateDog, input)

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

