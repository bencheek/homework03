'use strict'

const Koa = require('koa')
const koaBody = require('koa-body')
const koaCompress = require('koa-compress')
const koaCors = require('kcors')


const app = new Koa()

const { router } = require('./router.js')
const { loggingRouter } = require('./router.js')
const config = require('./config.js')

app
  .use(koaCompress())
  .use(koaCors())
  .use(koaBody())
  .use(loggingRouter.routes())
  .use(router.routes())
  .use(router.allowedMethods())

console.log('Listening on port ' + config.server.port)

app.listen(config.server.port)
