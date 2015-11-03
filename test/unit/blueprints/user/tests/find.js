'use strict';

var chai = require('chai'),
    expect = chai.expect;

module.exports = function() {
    describe('#find()', function() {
        var request;

        before(function() {
            request = require('supertest').agent(sails.hooks.http.app);
        });

        it('should succeed with 200 status', function(done) {
            request.get('/api/users')
                .expect(200)
                .end(done);
        });
    });
};