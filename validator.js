'use strict'

const jsonschema = require('jsonschema')


const validator = new jsonschema.Validator()

module.exports = {
  validate: (instance, schema) => validator.validate(instance, schema),
}
