'use strict';

var chai = require('chai'),
    expect = chai.expect;

describe('hook#sequelize', function() {
    it('should return a valid hook', function() {
        expect(sails.hooks.sqlize).to.exist;
        expect(sails.hooks.sqlize).to.contain.all.keys('Sequelize', 'response');
    });

    it('should produce valid Sequelize models', function() {
        var user = sails.sequelize['user'],
            Model = user.sequelize.Model;

        expect(user).to.be.an.instanceOf(Model);
    });

    describe('config', function() {
        it('should support sails logging', function() {
            expect(sails.sequelize['user'].sequelize.options.logging).to.equal(sails.log.silly);
        });
    });

    describe('queries', function() {
        it('should produce expected results', function(done) {
            sails.sequelize['user'].findAll({
                include: [{
                    model: sails.sequelize['organization'],
                    as: 'organization'
                }, {
                    model: sails.sequelize['profile'],
                    as: 'profile'
                }, {
                    model: sails.sequelize['group'],
                    as: 'groups'
                }]
            }).nodeify(function(err, results) {
                expect(err).to.not.exist;
                expect(results).to.be.an('array');
                expect(results.length).to.equal(10);
            });
            done();
        });
    });
});