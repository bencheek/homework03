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
  .get('/dog', authenticate, dogsController.list)
  .get('/dog/:id', authenticate, dogsController.read)
  .post('/dog', authenticate, dogsController.create)
  .put('/dog', authenticate, dogsController.update)
  .delete('/dog/:id', authenticate, dogsController.remove)

router.use(handleNotFound)

module.exports = router.routes()

