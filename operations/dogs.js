'use strict'

const errors = require('./../utils/errors')
const dogRespository = require('./../repositories/dogs')
const userRespository = require('./../repositories/users')

function list() {
  return dogRespository.findAll()
}

async function create(input) {
  const user = await userRespository.findById(input.userId)

  if (!user) {
    throw new errors.UserNotFoundError(`User with id ${input.userId} not found`)
  }

  return dogRespository.create(input)
}

function read(input) {
  return dogRespository.findById(input.id)
}

async function update(input) {
  const dogToUpdate = await dogRespository.findById(input.id)

  if (!dogToUpdate) {
    throw new errors.NotFoundError(`Dog with id ${input.id} not found`)
  }

  return dogRespository.update(dogToUpdate, input)
}

async function remove(input) {
  const dogToRemove = await dogRespository.findById(input.id)

  if (!dogToRemove) {
    throw new errors.NotFoundError(`Dog with id ${input.id} not found`)
  }

  return dogRespository.remove(input.id)
}

module.exports = {
  list,
  create,
  read,
  update,
  remove,
}
