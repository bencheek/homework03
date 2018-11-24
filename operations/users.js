'use strict'

const log = require('../utils/logger')
const userRepository = require('../repositories/users')
const errors = require('../utils/errors')
const crypto = require('../utils/crypto')
const dbConstants = require('../database/dbconstants')

async function signUp(input) {
  log.info({ email: input.email }, 'signUp')
  const user = {
    name: input.name,
    email: input.email.toLowerCase(),
    password: await crypto.hashPassword(input.password),
    disabled: false,
  }


  let newUser
  try {
    newUser = await userRepository.create(user)
  } catch (err) {
    if (err.constraint && err.constraint === dbConstants.CONSTRAINT_USER_EMAIL_UNIQUE) {
      throw new errors.ConflictError(`Email ${user.email} is already registered`)
    }
  }

  newUser.accessToken = await crypto.generateAccessToken(newUser.id)
  log.info({ email: input.email }, 'signUp successful')
  return newUser
}

async function signIn(input) {
  log.info({ email: input.email }, 'signIn')
  const user = {
    email: input.email.toLowerCase(),
    password: input.password,
  }
  const foundUser = await userRepository.findByEmail(user.email)
  if (!foundUser) {
    throw new errors.UnauthorizedError(`User with email ${user.email} not found.`)
  }

  const passwordOk = await crypto.comparePasswords(input.password, foundUser.password)

  if (!passwordOk) {
    throw new errors.UnauthorizedError(`Wrong password for user with email ${user.email}`)
  }

  foundUser.accessToken = await crypto.generateAccessToken(foundUser.id)

  log.info({ email: user.email }, 'signIn successful')

  return foundUser
}

async function verifyTokenPayload(input) {
  const jwtPayload = await crypto.verifyAccessToken(input.jwtToken)
  const now = Date.now()
  if (!jwtPayload || !jwtPayload.exp || now >= jwtPayload.exp * 1000) {
    throw new errors.UnauthorizedError()
  }

  const userId = parseInt(jwtPayload.userId)
  const user = await userRepository.findById(userId)
  if (!user || user.disabled) {
    throw new errors.UnauthorizedError()
  }
  log.info('verifyTokenPayload')
  return {
    user,
    loginTimeout: jwtPayload.exp * 1000,
  }
}

module.exports = {
  signUp,
  signIn,
  verifyTokenPayload,
}
