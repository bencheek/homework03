'use strict'

const request = require('supertest-koa-agent')
const { expect } = require('chai')
const app = require('../../../app')
const { resetDb } = require('../../helpers')
const usersRepository = require('../../../repositories/users')

describe('Users', () => {
  beforeEach(resetDb)

  context('POST /user', () => {
    const userData = {
      email: 'david@gmail.com',
      name: 'david',
    }

    it('responds with newly created user', async () => {
      const res = await request(app)
        .post('/user')
        .send({
          ...userData,
          password: '11111111',
        })
        .expect(201)

      expect(res.body).to.deep.include({
        ...userData,
        disabled: false,
        id: 1,
      })

      expect(res.body).to.have.all.keys([
        'name',
        'email',
        'disabled',
        'createdAt',
        'id',
        'accessToken',
      ])
    })

    it('responds with error when not all required attributes are in body', async () => {
      const res = await request(app)
        .post('/user')
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
        .post('/user')
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