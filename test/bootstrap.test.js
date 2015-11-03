var Sails = require('sails').Sails;

describe('Basic tests ::', function() {

    // Var to hold a running sails app instance
    var sails;

    // Before running any tests, attempt to lift Sails
    before(function (done) {
        // Hook will timeout in 10 seconds
        this.timeout(11000);

        // Attempt to lift sails
        Sails().lift({
            hooks: {
                //sockets: false,
                pubsub: false,
                views: false,
                //http: false,
                sqlize: require('../'),
                grunt: false
            },

            connections: {
                test: {
                    adapter: 'sails-mysql',
                    host: 'localhost',
                    port: 3306,
                    user: 'root',
                    password: 'password',
                    database: 'sails-hook-sqlize-test'
                }
            },

            models: {
                connection: 'test',
                migrate: 'drop',
                autoUpdatedAt: false,
                autoCreatedAt: false
            },

            sqlize: {
                connections: {
                    test: {
                        dialect: 'mysql',
                        pool: {
                            max: 5,
                            min: 0,
                            idle: 1000
                        },
                        logging: 'silly'
                    }
                },
                options: {
                    define: {
                        timestamps: false,
                        freezeTableName: true
                    }
                }
            },

            log: {
                level: "debug"
            }
        },function (err, _sails) {
            if (err) return done(err);
            sails = _sails;

            var barrels = new require('barrels')();

            async.series([
                function(fn) {
                    barrels.populate(['group', 'organization'], fn);
                },

                function(fn) {
                    barrels.populate(['user'], fn);
                }

            ], function(error) {
                if (error) {
                    sails.log.error('barrels error', error);
                    return done(error);
                }
                done();
            });
        });
    });

    // After tests are complete, lower Sails
    after(function (done) {

        // Lower Sails (if it successfully lifted)
        if (sails) {
            return sails.lower(done);
        }
        // Otherwise just return
        return done();
    });

    // Test that Sails can lift with the hook in place
    it ('sails does not crash', function() {
        return true;
    });
});