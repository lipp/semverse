/**
 * ### Entity model
 *
 * This module describes an Entity model
 * For the moment it's just a placeholder, though
 *
 * @module Models/Entity
 */
"use strict";

// Exported model name
exports.name = 'entity';

// Entities list
const entities = [];

/**
 * Create a new entity
 * @return {Object} New entity
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
 * @return {Object} Deleted entity
 */
exports.remove = () => entities.pop();

/**
 * Retrieve an entity
 * @return {Object} Retrieved entity
 */
exports.get = () => entities[0];

/**
 * Retrieve all entities
 * @return {Array<Object>} Entity list
 */
exports.getAll = () => entities;
