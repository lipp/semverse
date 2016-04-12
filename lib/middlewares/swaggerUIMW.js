'use strict';

const swaggerUiMW = require('swagger-tools/middleware/swagger-ui');
const spec = require('../../api/swagger.json');

/* Initialize Swagger UI middleware
 * @return {Object}     Swagger UI middleware
 */
function init() {
    return swaggerUiMW(spec, {
        // Available options:
        // apiDocs: '/api-docs'
        // swaggerUI: '/docs'
    });
}

module.exports = init;
