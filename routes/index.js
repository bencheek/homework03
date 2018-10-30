'use strict'

const Router = require('koa-router')
const { handleErrors, handleNotFound } = require('../middleware/errors')
const dogsController = require('./../controllers/dogs')

const router = new Router()

router.use(handleErrors)

router
  .get('/dog', dogsController.list)
  .get('/dog/:id', dogsController.read)
  .post('/dog', dogsController.create)
  .put('/dog', dogsController.update)
  .delete('/dog/:id', dogsController.remove)

router.use(handleNotFound)

module.exports = router.routes()

