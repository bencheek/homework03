'use strict'

const errors = require('./../utils/errors')
const dogRespository = require('./../repositories/dogs')
const userRespository = require('./../repositories/users')
const { NotFoundError } = require('./../utils/errors')

function list() {
  return dogRespository.findAll()
}

async function create(input) {

  const user = await userRespository.findById(input.userId)

  if (!user) {
    throw new errors.UserNotFoundError()
  }

  return dogRespository.create(input)
}

function read(input) {
  return dogRespository.findById(input.id)
}

async function update(input) {
  const dogToUpdate = await dogRespository.findById(input.id)

  if (!dogToUpdate) {
    throw new NotFoundError({}`Dog with id ${input.id} not found`)
  }

  return dogRespository.update(dogToUpdate, input)
}

function remove(input) {
  const dogToRemove = dogRespository.findById(input.id)

  if (!dogToRemove) {
    throw new NotFoundError(`Dog with id ${input.id} not found`)
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
