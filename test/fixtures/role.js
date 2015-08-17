'use strict';

var faker = require('faker');

var roles = [];
for (var i = 1; i < 11; i++) {
    var role = {
        id: i,
        name: faker.name.firstName(),
        groups: []
    };

    for (var a = 0; a < randBetween(1,3); a++) {
        var groupId = randBetween(1,10);
        role.groups.push(groupId);
    }

    roles.push(role);
}

function randBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = roles;