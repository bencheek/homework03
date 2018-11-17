'use strict'

const { User } = require('../database/models')

/**
 * Returns all records
 * @returns {Promisse<Array>}
 */
function findAll() {
  return User.query()
}

/**
 * Return record by id
 * @param {Number} id record id
 * @return {Promise<User>}
 */
function findById(id) {
  return User.query().findById(id)
}

/**
 * Return User record by email
 * @param {String} email user email
 * @return {Promise<User>}
 */
function findByEmail(email) {
  return User.query().findOne('email', email)
}

/**
 * Create record
 * @param {Object} user User object
 * @return {Promise<User>}
 */
function create(user) {
  return User.query().insertAndFetch(user)
}

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
}
