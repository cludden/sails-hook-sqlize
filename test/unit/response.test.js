'use strict';

var chai = require('chai'),
    expect = chai.expect;

describe('hook#sequelize.response', function() {

    describe('#flatten()', function() {

        it('should produce the expected result', function(done) {
            sails.sequelize['user'].findOne({
                where: {
                    id: 1
                },
                include: [{
                    model: sails.sequelize['organization'],
                    as: 'organization'
                }]
            }).nodeify(function(err, user) {
                console.log(err);
                expect(err).to.not.exist;
                expect(user).to.be.an('object');

                var response = sails.hooks.sequelize.response.flatten('user', user);
                expect(response).to.be.an('object');
                expect(response).to.contain.all.keys('user', 'organization');
                done();
            });
        });
    });
});