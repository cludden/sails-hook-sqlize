'use strict';

module.exports = function(sails) {
    return function(level, message) {
        sails.log[level]('(sails-hook-sequelize) ' + message);
    }
};