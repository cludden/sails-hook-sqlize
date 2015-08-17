'use strict';

module.exports = {
    attributes: {
        first: {
            type: 'string'
        },
        last: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        organization: {
            model: 'organization',
            columnName: 'organization_id'
        },
        groups: {
            collection: 'group',
            via: 'users'
        }
    }
};