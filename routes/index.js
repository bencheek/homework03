'use strict'

const Router = require('koa-router')
const dogsController = require('./../controllers/dogs')

const router = new Router()

// TODO : router.use(handleErrors)

router
  .get('/dog', dogsController.list)
  .get('/dog/:id', dogsController.read)
  .post('/dog', dogsController.create)
  .put('/dog', dogsController.update)
  .delete('/dog/:id', dogsController.remove)

// TODO : router.use(handleNotFound)

module.exports = router.routes()

