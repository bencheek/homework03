'use strict'

const R = require('ramda')
const dogs = require('./../database/dogs.json')


function findAll() {
  return dogs
}

function findById(id) {
  const dog = R.find(R.propEq('id', id), dogs)
  if (!dog) {
    throw new Error('Not found')
  }
  return dog
}

function create(dog) {
  dog.id = dogs.length + 1
  dogs.push(dog)
  return dog
}

function remove(id) {
  return R.reject(R.propEq('id', id), dogs)
}

function update(dog) {
  return R.merge(R.find(R.propEq('id', dog.id)), dog)
}

module.exports = {
  findAll,
  findById,
  create,
  remove,
  update,
}
