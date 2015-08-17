'use strict';

module.exports = {
    attributes: {
        name: {
            type: 'string'
        },
        users: {
            collection: 'user',
            via: 'groups'
        },
        roles: {
            collection: 'role',
            via: 'groups'
        }
    }
};