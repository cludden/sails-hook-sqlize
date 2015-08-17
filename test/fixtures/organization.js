'use strict';

var faker = require('faker');

var organizations = [];
for (var i = 1; i < 11; i++) {
    organizations.push({
        id: i,
        name: faker.company.companyName()
    });
}

module.exports = organizations;