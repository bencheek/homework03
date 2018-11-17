'use strict'

const errors = require('./../utils/errors')
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
  return dogRespository.update(input)
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
