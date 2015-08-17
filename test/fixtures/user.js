'use strict';

var faker = require('faker');

var users = [];
for (var i = 1; i < 11; i++) {
    var user = {
        id: i,
        first: faker.name.firstName(),
        last: faker.name.lastName(),
        email: faker.internet.email(),
        organization: randBetween(1,10),
        groups: []
    };

    for (var a = 0; a < randBetween(1,3); a++) {
        var groupId = randBetween(1,10);
        user.groups.push(groupId);
    }

    users.push(user);
}

function randBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = users;