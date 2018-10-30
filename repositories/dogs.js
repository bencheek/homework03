'use strict'

const R = require('ramda')
let dogs = require('./../database/dogs.json')


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
  return dogs
}

function remove(id) {
  return R.reject(R.propEq('id', id), dogs)
}

function update(dogToUpdate, newDogVersion) {
  const newDog = R.merge(dogToUpdate, newDogVersion)
  const dogIndex = R.findIndex(R.propEq('id', dogToUpdate.id), dogs)
  dogs = R.update(dogIndex, newDog, dogs)
  return dogs
}

module.exports = {
  findAll,
  findById,
  create,
  remove,
  update,
}
