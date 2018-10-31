'use strict'

const createDog = {
  type: 'Object',
  required: true,
  properties: {
    name: { type: 'string', required: true, maxLength: 80 },
    breed: { type: 'string', required: true, maxLength: 80 },
    birthYear: { type: 'integer' },
    photo: { type: 'string', format: 'url' },
  },
}

const updateDog = {
  type: 'Object',
  required: true,
  properties: {
    id: { type: 'integer', required: true },
    name: { type: 'string', maxLength: 80 },
    breed: { type: 'string', maxLength: 80 },
    birthYear: { type: 'integer' },
    photo: { type: 'string', format: 'url' },
  },
}

module.exports = {
  createDog,
  updateDog,
}
