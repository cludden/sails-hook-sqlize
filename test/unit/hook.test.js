'use strict';

var chai = require('chai'),
    expect = chai.expect;

var Sequelize = require('sequelize');

describe('hook#sequelize', function() {
    it('should return a valid hook', function() {
        expect(sails.hooks.sequelize).to.exist;
        expect(sails.hooks.sequelize).to.contain.all.keys('Sequelize', 'response');
    });

    it('should produce valid Sequelize models', function() {
        var user = sails.sequelize['user'],
            Model = user.sequelize.Model;

        expect(user).to.be.an.instanceOf(Model);
    });

    describe('queries', function() {
        it('should produce expected results', function(done) {
            sails.sequelize['user'].findAll({}).nodeify(function(err, results) {
                expect(err).to.not.exist;
                expect(results).to.be.an('array');
                expect(results.length).to.equal(10);
            });
            done();
        });
    });
});