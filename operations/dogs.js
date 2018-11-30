'use strict'

const rekognition = require('../services/rekognition')
const dogRespository = require('./../repositories/dogs')

function list() {
  return dogRespository.findAll()
}

async function create(input) {
  return dogRespository.create({
    ...input,
    photoVerified: await rekognition.isDogRecognized(input.photo),
  })
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
