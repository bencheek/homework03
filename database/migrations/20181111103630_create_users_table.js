'use strict'

const dbConstants = require('../dbconstants')

module.exports = {
  up: knex => knex.schema.createTable('users', table => {
    table.increments('id').primary()
    table.string('email').unique(dbConstants.CONSTRAINT_USER_EMAIL_UNIQUE).notNullable()
    table.string('name').notNullable()
    table.string('password').notNullable()
    table.boolean('disabled')
    table.timestamps()
    table.index('email')
  }),

  down: knex => knex.schema.dropTableIfExists('users'),
}
