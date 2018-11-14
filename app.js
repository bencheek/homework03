'use strict'

const Koa = require('koa')
const koaBody = require('koa-body')
const koaCompress = require('koa-compress')
const koaCors = require('kcors')

const app = new Koa()

const router = require('./routes')
const config = require('./config')
const log = require('./utils/logger')

app
  .use(koaCompress())
  .use(koaCors())
  .use(koaBody())
  .use(router)


app.on('error', err => log.error(err))

log.info(`Listening on port ${config.server.port}`)

app.listen(config.server.port)

module.exports = app
