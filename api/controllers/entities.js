'use strict';

const
    _ = require('lodash'),

    swUtils = require('../swaggerUtils'),

module.exports = {
    // List entities based on given criterias
    listEntities: (req, res) => Promise
        .resolve(_.get(req, 'params.order'))
        .then(models.entities.list)
        .then(respond(200))
        .catch(swUtils.errorHandler),

    // Create an entity
    createEntity: (req, res) => Promise
        .resolve(swUtils.getBody(req))
        .then(models.entities.create)
        .then(() => respond(201, {}))
        .catch(swUtils.errorHandler)
}
