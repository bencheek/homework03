'use strict'

const Router = require('koa-router')
const { handleErrors, handleNotFound } = require('../middleware/errors')
const users = require('../controllers/users')
const dogsController = require('./../controllers/dogs')
const { authenticate } = require('./../middleware/authentication')

const router = new Router()

router.use(handleErrors)

router.post('/users', users.signUp)
router.post('/sessions/user', users.signIn)

router
  .get('/dogs', authenticate, dogsController.list)
  .get('/dogs/:id', authenticate, dogsController.read)
  .post('/dogs', authenticate, dogsController.create)
  .put('/dogs', authenticate, dogsController.update)
  .delete('/dogs/:id', authenticate, dogsController.remove)

router.use(handleNotFound)

module.exports = router.routes()

