'use strict'

const Koa = require('koa')
const koaBody = require('koa-body')
const koaCompress = require('koa-compress')
const koaCors = require('kcors')

const app = new Koa()

const { router } = require('./router.js')
const config = require('./config.js')
const log = require('./logger')

app
  .use(koaCompress())
  .use(koaCors())
  .use(koaBody())
  .use(async (ctx, next) => {
    log.info(ctx.request.url)
    await next()
    log.info(ctx.response.body)
  })
  .use(router.routes())
  .use(router.allowedMethods())

log.info(`Listening on port ${config.server.port}`)

app.listen(config.server.port)
