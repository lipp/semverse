/**
 * ### Entity model
 *
 * This module describes an Entity model
 * For the moment it's just a placeholder, though
 *
 * @module Models/Entity
 */
"use strict";

/**
 * Instanciate Entities model
 * @return {Object} Entites model instance
 */
exports.factory = function factory( /*sequelize*/ ) {

    const instance = {};

    // Exported model name
    instance.name = 'entity';

    // Entities list
    const entities = [];

    /**
     * Create a new entity
     * @return {Object} New entity
     */
    instance.create = function create() {
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
    instance.remove = () => entities.pop();

    /**
     * Retrieve an entity
     * @return {Object} Retrieved entity
     */
    instance.get = () => entities[0];

    /**
     * Retrieve all entities
     * @return {Array<Object>} Entity list
     */
    instance.getAll = () => entities;

    return instance;
};
