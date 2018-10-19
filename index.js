"use strict"

const Koa = require("koa")
const KoaBody = require("koa-body")
const KoaCompress = require("koa-compress")
const KoaCors = require("kcors")
const app = new Koa()

const { router } = require("./router.js")
const { loggingRouter } = require("./router.js")
const config = require("./config.js")

app
.use(KoaCompress())
.use(KoaCors())
.use(KoaBody())
.use(loggingRouter.routes())
.use(router.routes())
.use(router.allowedMethods())

console.log("Listening on port " + config.server.port)

app.listen(config.server.port)