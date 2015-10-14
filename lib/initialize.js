'use strict';

var async = require('async'),
    _ = require('lodash');

module.exports = function(sails, Sequelize) {
    var log = require('./utils/log')(sails);

    return function initialize(cb) {
        var config = sails.config[this.configKey] || {},
            defaults = config.options || {},
            connections = config.connections || {},
            connectionNames = _.keys(connections),
            self = this;

        async.auto({
            // build sequelize instances for each applicable connection
            connections: function(fn) {
                async.map(connectionNames, function(name, _fn) {
                    var connectionOptions = connections[name],
                        connection = sails.config.connections[name],
                        res = {name: name};

                    // throw error if no connection with the given name is found in sails config
                    if (!connection) { return _fn('Unable to locate connection for with name: \'' + name + '\''); }

                    // otherwise, use the connection info to create a new sequelize instance
                    connectionOptions = _.extend(connectionOptions, {
                        host: connection.host
                    }, defaults);
                    
                    // convert {logging: 'silly'} to {logging: sails.log.silly}
                    if (connectionOptions.logging && _.isString(connectionOptions.logging)) {
                        connectionOptions.logging = sails.log[connectionOptions.logging]
                    }

                    res.sequelize = new Sequelize(connection.database, connection.user, connection.password, connectionOptions);
                    _fn(null, res);
                }, function(err, connections) {
                    if (err) {
                        log('error', 'error creating sequelize connections', err);
                        return fn(err);
                    }
                    connections = _.zipObject(_.map(connections, function(hash) {
                        return [hash.name, hash.sequelize];
                    }));
                    fn(null, connections);
                });
            },

            // test connections to ensure validity
            testConnections: ['connections', function(fn, results) {
                async.map(_.pairs(results.connections), function(connectionArray, _fn) {
                    connectionArray[1].query('SELECT 1+1 AS result').then(function() {
                        return _fn();
                    }, function(err) {
                        return _fn('connection error for ' + connectionArray[0] + ': ' + err);
                    });
                }, function(err) {
                    if (err) { return fn(err); }
                    return fn();
                });
            }],

            buildModels: ['connections', require('./utils/build-models')(sails)],

            buildAssociations: ['buildModels', require('./utils/build-associations')(sails)]

        }, function(err) {
            self.response = require('./response')(sails, Sequelize, config);
            if (err) {
                log('error', '#initialize()', err);
                return cb('sails-hook-sqlize error');
            }
            log('silly', '#initialize()', 'finished!');
            cb();
        });
    }
};