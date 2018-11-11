'use strict'

const R = require('ramda')
const { Dog } = require('../database/models')

/**
 * Returns all records
 * @returns {Promisse<Array>}
 */
function findAll() {
  return Dog.query()
}

/**
 * Return record by id
 * @param {Number} id record id
 * @return {Promise<Dog>}
 */
function findById(id) {
  return Dog.query().findById(id)
}

/**
 * Create record
 * @param {Object} dog Dog object
 * @param {String} dog.name Dog name
 * @param {String} dog.breed Dog breed
 * @param {Date} dog.birthYear Dog birth year
 * @param {String} dog.photo Dog photo
 * @param {Number} dog.userId Dog owner id
 * @return {Promise<Dog>}
 */
async function create(dog) {
  const newDog = await Dog.query().insertAndFetch(dog)
  return newDog
}

function remove(id) {
  return Dog.query().deleteById(id)
}

function update(dogToUpdate, newDogVersion) {
  const newDog = R.merge(dogToUpdate, newDogVersion)
  Dog.query().patch(newDog).where('id', dogToUpdate.id)
  return Dog.query()
}

module.exports = {
  findAll,
  findById,
  create,
  remove,
  update,
}
