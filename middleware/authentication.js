'use strict'

const operations = require('../operations/users')
const errors = require('./../utils/errors')
const { validate } = require('./../validations/validator')
const schemas = require('./../validations/schema/users')


async function authenticate(ctx, next) {
  if (!ctx) {
    throw new Error('Context has to be defined')
  }

  if (!ctx.header.authorization) {
    throw new errors.UnauthorizedError()
  }

  const input = { jwtToken: ctx.header.authorization }
  validate(schemas.jwtToken, input)
  const data = await operations.verifyTokenPayload(input)
  if (ctx.response && data.loginTimeout) {
    ctx.set('Login-timeout', data.loginTimeout)
  }
  ctx.state.user = data.user
  return next()
}

module.exports = {
  authenticate,
}
