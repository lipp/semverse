/**
 * ### Entity model
 *
 * This module describes an Entity model
 *
 * @module Models/Entity
 */
"use strict";

exports.factory = function factory( /*sequelize*/ ) {

    const instance = {};

    // Exported model name for model grouping
    instance.name = 'entity';

    // Entities list
    const entities = [];

    /**
     * Create a new entity
     * @return {String} New entity
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
     * @return {String} Deleted entity
     */
    instance.remove = function remove() {
        const entity = entities.pop();
        return entity;
    };

    /**
     * Retrieve an entity
     * @return {String} Retrieved entity
     */
    instance.get = function get() {
        const entity = entities[0];
        return entity;
    };

    /**
     * Retrieve all entities
     * @return {Array} Entity list
     */
    instance.getAll = function getAll() {
        return entities;
    };

    return instance;
};
