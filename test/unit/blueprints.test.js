var includeAll = require('include-all');

describe('hook#sequelize.blueprints', function() {
    includeAll({
        dirname: __dirname + '/blueprints',
        filter: /(.+\.test)\.js$/
    })
});