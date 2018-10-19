"use strict"

const Router = require("koa-router")
const router = new Router()
const validator = require("./validator")
const dogSchema = require("./schema/dog.json")
const dogsArray = require("./data/dogs")
const log = require("./logger")

const loggingRouter = new Router({
    prefix: "/"
}).all("",ctx => {
    log.info("Request arrived")
})

router.get("/", ctx => {
    log.info("GET /")
    ctx.body = "Dogbook backend server"
})
.get("/dog", ctx => {
    ctx.body = dogsArray
})
.get("/dog/:id", ctx => {
    
    const dog = dogsArray.find(dog => dog.id === Number(ctx.params.id))
    
    if (!dog) {
        ctx.status = 404
        return
    }

    ctx.body = dog
})
.post("/dog", ctx => {

    const newDog = ctx.request.body

    const result = validator.validate(newDog, dogSchema)

    if (!result.valid) {
        ctx.status = 400
        ctx.body = {
            errors : result.errors
        }
        return
    }

    const existingDog = dogsArray.find(dog => dog.id === newDog.id)

    if (existingDog) {
        ctx.status = 409
        return
    }

    dogsArray.push(newDog)

    ctx.body = dogsArray;
})
.delete("/dog/:id", ctx => {
     
    const dogIndex = dogsArray.findIndex(dog => dog.id === Number(ctx.params.id))
    
    if (dogIndex < 0) {
        ctx.status = 404
        return
    }

    dogsArray.splice(dogIndex, 1)
    ctx.body = dogsArray
   
})
.put("/dog/:id", ctx => {

    const dogIndex = dogsArray.findIndex(dog => dog.id === Number(ctx.params.id))
    
    if (dogIndex < 0) {
        ctx.status = 404
        return
    } 

    const updatedDog = ctx.request.body
    const result = validator.validate(updatedDog, dogSchema)

    if (!result.valid) {
        ctx.status = 400
        ctx.body = {
            errors : result.errors
        }
        return
    }
    
    dogsArray[dogIndex] = ctx.request.body    
    ctx.body = dogsArray

})

module.exports = {
    router : router,
    loggingRouter : loggingRouter
}
