'use strict'

const operations = require('../operations/users')
const errors = require('../utils/errors')
const { validate } = require('./../validations/validator')
const schemas = require('./../validations/schema/users')


async function authenticate(ctx, next) {
  if (!ctx) {
    throw new Error('Context has to be defined')
  }
  const parsedHeader = await parseHeader(ctx.header.authorization)
  if (!parsedHeader || !parsedHeader.value
    || !parsedHeader.scheme || parsedHeader.scheme.toLowerCase() !== 'jwt'
  ) {
    return null
  }
  const input = { jwtToken: parsedHeader.value }
  validate(schemas.jwtToken, input)
  const data = await operations.verifyTokenPayload(input)
  if (ctx.response && data.loginTimeout) {
    ctx.set('Login-timeout', data.loginTimeout)
  }
  ctx.state.user = data.user
  return next()
}

function parseHeader(hdrValue) {
  if (!hdrValue || typeof hdrValue !== 'string') {
    return null
  }

  const parts = hdrValue.split('.')

  if (parts.length !== 3) {
    throw new errors.UnauthorizedError('JWT Token must have three parts separated by dots')
  }

  return {
    scheme: parts[1],
    value: parts[2],
  }
}

module.exports = {
  authenticate,
}
