/**
 * ### Entity model
 *
 * This module describes an Entity model
 *
 * @module Models/Entity
 */
"use strict";

// Entities list
const entities = [];

/**
 * Create a new entity
 * @return {String} New entity
 */
exports.create = function create() {
    const newEntity = {
        id: entities.length,
        name: "newEntity"
    };
    entities.push(newEntity);
    return newEntity;
};

/**
 * Delete an entity
 * @return {String} Deleted entity
 */
exports.remove = function remove() {
    const entity = entities.pop();
    return entity;
};

/**
 * Retrieve an entity
 * @return {String} Retrieved entity
 */
exports.get = function get() {
    const entity = entities[0];
    return entity;
};

/**
 * Retrieve all entities
 * @return {Array} Entity list
 */
exports.getAll = function getAll() {
    return entities;
};
