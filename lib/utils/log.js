'use strict';

module.exports = function(sails) {
    return function(level) {
        var args = Array.prototype.slice.call(arguments, 1);
        args.unshift('[hook] sqlize');
        sails.log[level].apply(this, args);
    }
};