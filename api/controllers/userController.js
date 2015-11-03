'use strict';

module.exports = {
    find: function(req, res) {
        sails.hooks.sqlize.blueprints.find(req, res);
    }
};