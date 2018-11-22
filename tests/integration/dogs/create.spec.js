'use strict'

const request = require('supertest-koa-agent')
const { expect, assert } = require('chai')
const Chance = require('chance')
const sinon = require('sinon')
const app = require('../../../app')
const { resetDb } = require('../../helpers')
const dogApi = require('../../../services/dogapi')
const dogsRepository = require('../../../repositories/dogs')

const sandbox = sinon.createSandbox()

describe('Dogs', () => {
  beforeEach(resetDb)

  context('CRUD /dogs', () => {
    const chance = new Chance()

    const dogData = {
      name: chance.name(),
      breed: chance.animal({ type: 'pet' }),
      birthYear: chance.integer({ min: 2000, max: 2018 }),
      photo: chance.url({ domain: 'domain.com',
        path: 'images',
        extensions: ['jpg', 'png'] }),
    }

    const updatedDogData = {
      ...dogData,
      name: `${dogData.name}2`,
      breed: `${dogData.breed}2`,
      photo: `${dogData.photo}2`,
      birthYear: dogData.birthYear + 1,
    }

    let userToken

    beforeEach(async () => {
      const res = await request(app)
        .post('/users')
        .send({
          email: chance.email({ domain: 'sfs.cz' }),
          name: chance.name(),
          password: '11111111',
        })
        .expect(201)

      userToken = res.body.accessToken

      sandbox.stub(dogApi, 'getRandomBreedImage')
        .returns(Promise.resolve(dogData.photo))
    })

    it('reads all existing dogs', async () => {
      await dogsRepository.create(dogData)

      const res = await request(app)
        .get('/dogs')
        .set('Authorization', `${userToken}`)
        .expect(200)

      expect(res.body).to.be.an('Array')
      expect(res.body).to.have.length(1)
      expect(res.body[0]).to.deep.include({
        ...dogData,
      })
    })

    it('reads dog by id', async () => {
      const doggie = await dogsRepository.create(dogData)

      const res = await request(app)
        .get(`/dogs/${doggie.id}`)
        .set('Authorization', `${userToken}`)
        .expect(200)

      expect(res.body).to.deep.include({
        ...dogData,
      })
    })


    it('deletes a dog', async () => {
      const doggie = await dogsRepository.create(dogData)

      const res = await request(app)
        .delete(`/dogs/${doggie.id}`)
        .set('Authorization', `${userToken}`)
        .expect(200)

      expect(res.body).to.be.a('Number')
      expect(res.body).to.be.equal(1)
      const deletedDoggie = await dogsRepository.findById(doggie.id)
      assert.isUndefined(deletedDoggie)
    })

    it('cannot delete a nonexisting dog', async () => {
      const res = await request(app)
        .delete('/dogs/10')
        .set('Authorization', `${userToken}`)
        .expect(200)

      expect(res.body).to.be.a('Number')
      expect(res.body).to.be.equal(0)
    })

    it('updates a dogs', async () => {
      const doggie = await dogsRepository.create(dogData)

      const updatedDog = {
        ...updatedDogData,
        id: doggie.id,
      }

      const res = await request(app)
        .put('/dogs')
        .set('Authorization', `${userToken}`)
        .send(updatedDog)
        .expect(200)

      expect(res.body).to.deep.include({
        ...updatedDog,
      })
    })

    it('cannot update a nonexisting dog', async () => {
      const updatedDog = {
        ...updatedDogData,
        id: 10,
      }

      await request(app)
        .put('/dogs')
        .set('Authorization', `${userToken}`)
        .send(updatedDog)
        .expect(204)
    })

    it('responds with newly created dog', async () => {
      sinon.mock(dogApi)

      const res = await request(app)
        .post('/dogs')
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
