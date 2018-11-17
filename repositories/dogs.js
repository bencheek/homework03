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
function create(dog) {
  const newDog = Dog.query().insertAndFetch(dog)
  return newDog
}

/**
 * Delete record by id
 * @param {Number} id id of record to delete
 * @return {Promise<Number>} number of deleted records
 */
function remove(id) {
  return Dog.query().deleteById(id)
}

/**
 * Update a dog record
 * @param {Object} dogToUpdate original Dog object to update
 * @param {Object} newDogVersion new version of Dog 
 * @return {Promise<Dog>} resulting dog
 */
function update(dogToUpdate, newDogVersion) {
  const newDog = R.merge(dogToUpdate, newDogVersion)
  const updatedDog = Dog.query().patchAndFetchById(dogToUpdate.id, newDog)
  return updatedDog
}

module.exports = {
  findAll,
  findById,
  create,
  remove,
  update,
}
