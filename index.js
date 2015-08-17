'use strict';

var Sequelize = require('sequelize');

module.exports = function(sails) {
    return {
        initialize: require('./lib/initialize')(sails, Sequelize),
        Sequelize: Sequelize,
        response: require('./lib/response')(sails, Sequelize)
    }
};