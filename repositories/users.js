'use strict'

const { User } = require('../database/models')

function findAll() {
  return User.query()
}

function findById(id) {
  return User.query().findById(id)
}

function findByEmail(email) {
  return User.query()
    .where('email', email)
    .first()
}

async function create(user) {
  const newUser = await User.query().insertAndFetch(user)
  return newUser
}

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
}
