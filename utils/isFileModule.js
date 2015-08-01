'use strict';

/*
 *  Borrowed from express-enrouten
 *  https://github.com/krakenjs/express-enrouten/blob/v1.2.x-release/lib/directory.js
 */

var path = require('path');

/**
 * Returns true if `require` is able to load the provided file
 * or false if not.
 * http://nodejs.org/api/modules.html#modules_file_modules
 * @param file the file for which to determine module-ness.
 * @returns {boolean}
 */
function isFileModule(file) {
    var ext = path.extname(file);

    // Omit dotfiles
    // NOTE: Temporary fix in lieu of more complete (cross platform)
    // fix using file flags/attributes.
    if (path.basename(file, ext)[0] === '.') {
        return false;
    }

    try {
        // remove the file extension and use require.resolve to resolve known
        // file types eg. CoffeeScript. Will throw if not found/loadable by node.
        file = ext ? file.slice(0, -ext.length) : file;
        require.resolve(file);
        return true;
    } catch (err) {
        return false;
    }
};

module.exports = isFileModule;