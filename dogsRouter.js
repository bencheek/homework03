'use strict'

const Router = require('koa-router')
const dogsController = require('./dogsController')

const dogsRouter = new Router()

dogsRouter
  .get('/dog', dogsController.list)
  .get('/dog/:id', dogsController.read)
  .post('/dog', dogsController.create)
  .put('/dog/:id', dogsController.update)
  .delete('/dog/:id', dogsController.delete)

module.exports = dogsRouter

