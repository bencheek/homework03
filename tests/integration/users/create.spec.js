'use strict'

const request = require('supertest-koa-agent')
const { expect } = require('chai')
const Chance = require('chance')
const app = require('../../../app')
const { resetDb } = require('../../helpers')
const usersRepository = require('../../../repositories/users')
const crypto = require('../../../utils/crypto')

describe('Users', () => {
  beforeEach(resetDb)

  context('POST /users', () => {
    const chance = new Chance()

    const userData = {
      email: chance.email({ domain: 'example.com' }),
      name: chance.name(),
    }

    it('responds with newly created user', async () => {
      const signUpResponse = await request(app)
        .post('/users')
        .send({
          ...userData,
          password: '11111111',
        })
        .expect(201)

      expect(signUpResponse.body).to.deep.include({
        ...userData,
        disabled: false,
        id: 1,
      })


      expect(signUpResponse.body).to.have.all.keys([
        'name',
        'email',
        'disabled',
        'createdAt',
        'id',
        'accessToken',
      ])
    })

    it('logs in existing user and allows access protected URL', async () => {
      await usersRepository.create({
        ...userData,
        disabled: false,
        password: await crypto.hashPassword('11111111'),
      })

      // log in correct user and password
      const logInResponse = await request(app)
        .post('/sessions/user')
        .send({
          ...userData,
          password: '11111111',
        })
        .expect(201)

      expect(logInResponse.body).to.deep.include({
        ...userData,
        disabled: false,
        id: 1,
      })

      expect(logInResponse.body).to.have.all.keys([
        'name',
        'email',
        'disabled',
        'createdAt',
        'id',
        'accessToken',
      ])

      // use logged user to access GET /dog
      await request(app)
        .get('/dogs')
        .set('Authorization', `${logInResponse.body.accessToken}`)
        .send()
        .expect(200)
    })

    it('denies user to access protected URL without JWT token', async () => {
      // try to access GET /dog without JWT token,
      await request(app)
        .get('/dogs')
        .send()
        .expect(401)
    })

    it('denies user to access protected URL with invalid JWT token', async () => {
      // try to access GET /dog with wrong JWT token
      await request(app)
        .get('/dogs')
        .set('Authorization', 'XXX.XXX.XXX')
        .send()
        .expect(401)
    })

    it('denies user to access protected URL with nonexistent user JWT token', async () => {
      const nonExistentUserToken = await crypto.generateAccessToken(2)
      // try to access GET /dog with wrong JWT token
      await request(app)
        .get('/dogs')
        .set('Authorization', nonExistentUserToken)
        .send()
        .expect(401)
    })

    it('denies nonexisting user to log in', async () => {
      // log in nonexistent user
      await request(app)
        .post('/sessions/user')
        .send({
          email: chance.email({ domain: 'nonexistentdomain.com' }),
          password: '11111111',
        })
        .expect(401)
    })

    it('denies user with invalid password to log in', async () => {
      await usersRepository.create({
        ...userData,
        disabled: false,
        password: await crypto.hashPassword('11111111'),
      })

      // log in user with incorrect password
      await request(app)
        .post('/sessions/user')
        .send({
          ...userData,
          password: '22222222',
        })
        .expect(401)
    })

    it('responds with error when not all required attributes are in body', async () => {
      const res = await request(app)
        .post('/users')
        .send({})
        .expect(400)

      expect(res.body).includes.keys([
        'message',
        'type',
      ])
    })

    it('responds with error when email is already taken', async () => {
      await usersRepository.create({
        ...userData,
        password: '111',
      })

      const res = await request(app)
        .post('/users')
        .send({
          ...userData,
          password: '11111111',
        })
        .expect(409)

      expect(res.body).includes.keys([
        'message',
        'type',
      ])
    })
  })
})
