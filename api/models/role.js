'use strict';

module.exports = {
    attributes: {
        name: {
            type: 'string'
        },
        groups: {
            collection: 'group',
            via: 'roles'
        }
    }
};