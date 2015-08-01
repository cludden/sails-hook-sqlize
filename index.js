'use strict';

var Sequelize = require('Sequelize'),
    path = require('path'),
    traverse = require('./utils/traverse'),
    isFileModule = require('./utils/isFileModule');

module.exports = function(sails) {
    function log(level, message) {
        sails.log[level]('[sails-hook-sequelize] ' + message);
    }

    return {
        initialize: function(cb) {
            var blacklist = ['default'],
                options = {};

            if (sails.config.sequelize && sails.config.sequelize.connections) {
                options = sails.config.sequelize.connections
            }

            var connectionNames = _.keys(options);

            async.auto({
                // build sequelize instances for each applicable connection
                connections: function(fn) {
                    async.map(connectionNames, function(name, _fn) {
                        var connectionOptions = options[name],
                            connection = sails.config.connections[name],
                            res = {name: name};

                        // throw error if no connection with the given name is found in sails config
                        if (!connection) { return _fn('Unable to locate connection for with name: \'' + name + '\''); }

                        // otherwise, use the connection info to create a new sequelize instance
                        connectionOptions = _.extend(_.omit(connectionOptions, blacklist), {host: connection.host});
                        res.sequelize = new Sequelize(connection.database, connection.user, connection.password, connectionOptions);
                        _fn(null, res);
                    }, function(err, connections) {
                        if (err) {
                            log('error', err);
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
                    })
                }],

                buildModels: ['connections', require('./lib/build-models')(sails)],

                buildAssociations: ['buildModels', require('./lib/build-associations')(sails)]

            }, function(err) {
                if (err) {
                    log('error', err);
                    return cb('sails-hook-sequelize error');
                }
                log('silly', 'finished!');
                cb();
            });

        }
    }
};