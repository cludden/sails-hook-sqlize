'use strict';

var Sequelize = require('sequelize');

module.exports = function(sails) {
    return {
        /**
         * Default config options
         */
        defaults: {
            __configKey__: {

            }
        },

        initialize: require('./lib/initialize')(sails, Sequelize),
        Sequelize: Sequelize
    }
};