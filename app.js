'use strict'

const Koa = require('koa')
const koaBody = require('koa-body')
const koaCompress = require('koa-compress')
const koaHelmet = require('koa-helmet')
const koaCors = require('kcors')

const app = new Koa()

const router = require('./routes')
const config = require('./config')
const log = require('./utils/logger')

const services = {
  server: null,
}

app
  .use(koaHelmet())
  .use(koaCompress())
  .use(koaCors())
  .use(koaBody())
  .use(router)

// Define start method
app.start = async () => {
  log.info('Starting app…')

  // Start any services here:
  // e.g. database connection.

  services.server = await new Promise((resolve, reject) => {
    const listen = app.listen(config.server.port, err => err ? reject(err) : resolve(listen))
  })
}

// Define app shutdown
app.stop = async () => {
  log.info('Stopping app…')

  // Stop everything now.
  // e.g. close database connection

  await services.server.close()
}

// Start app
if (require.main === module) {
  app.start()
    .then(() => log.info(`App is running on port ${config.server.port}`))
    .catch(err => log.error(err))
}

process.once('SIGINT', () => app.stop())
process.once('SIGTERM', () => app.stop())

module.exports = app
