'use strict'

const dogRespository = require('./../repositories/dogs')
const { NotFoundError } = require('./../utils/errors')

function list() {
  return dogRespository.findAll()
}

function create(input) {
  return dogRespository.create(input)
}

function read(input) {
  return dogRespository.findById(input.id)
}

function update(input) {
  const dogToUpdate = dogRespository.findById(input.id)

  if (!dogToUpdate) {
    throw new NotFoundError(`Dog with id ${input.id} not found`)
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
