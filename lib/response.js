'use strict';

module.exports = function(sails, Sequelize) {
    return {
        flatten: require('./responses/flatten')(sails, Sequelize)
    }
};