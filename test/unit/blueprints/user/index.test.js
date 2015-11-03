'use strict';

var includeAll = require('include-all');

describe('[controller] user', function() {
    var tests = includeAll({
        dirname:  __dirname + '/tests',
        filter:  /\.js$/
    });

    for(var test in tests) {
        tests[test]();
    }
});