'use strict';

module.exports = function(sails, Sequelize, config) {
    return {
        flatten: require('./responses/flatten')(sails, Sequelize, config)
    }
};