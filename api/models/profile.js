'use strict'

module.exports = {
    attributes: {
        favoriteColor: {
            type: 'string'
        },

        user: {
            model: 'user',
            columnName: 'user_id'
        }
    }
};