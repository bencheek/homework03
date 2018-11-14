'use strict'

const request = require('supertest-koa-agent')
const { expect } = require('chai')
const sinon = require('sinon')
const app = require('../../../app')
const { resetDb } = require('../../helpers')
const dogApi = require('../../../services/dogapi')

const sandbox = sinon.createSandbox()

describe('Dogs', () => {
  beforeEach(resetDb)

  context('POST /dog', () => {
    let userToken

    beforeEach(async () => {
      const res = await request(app)
        .post('/user')
        .send({
          email: 'mail@sfs.cz',
          name: 'david',
          password: '11111111',
        })
        .expect(201)

      userToken = res.body.accessToken

      sandbox.stub(dogApi, 'getRandomBreedImage')
        .returns(Promise.resolve('http://domain.com/image.jpg'))
    })

    it('responds with newly created dog', async () => {
      sinon.mock(dogApi)
      const dogData = {
        name: 'Azor',
        breed: 'chihuahua',
        birthYear: 2000,
        photo: 'http://domain.com/image.jpg'
      }

      const res = await request(app)
        .post('/dog')
        .set('Authorization', `${userToken}`)
        .send(dogData)
        .expect(201)

      expect(res.body).to.deep.include({
        ...dogData,
      })

      expect(res.body.photo).to.be.a('string')

      expect(res.body.photo).to.not.be.empty // eslint-disable-line no-unused-expressions

      expect(res.body).to.have.all.keys([
        'name',
        'createdAt',
        'updatedAt',
        'userId',
        'id',
        'breed',
        'birthYear',
        'photo',
      ])
    })

    afterEach(() => sandbox.restore())
  })
})
