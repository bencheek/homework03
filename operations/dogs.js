'use strict'

const dogRespository = require('./../repositories/dogs')

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
    throw Error(`Dog with id ${input.id} not found`)
  }

  return dogRespository.update(dogToUpdate, input)
}

function remove(input) {
  return dogRespository.remove(input.id)
}

module.exports = {
  list,
  create,
  read,
  update,
  remove,
}
