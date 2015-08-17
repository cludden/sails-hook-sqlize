/*
 *  Convert a sails attribute definition into an equivelant
 *  sequelize attribute definition
 */

'use strict';

var Sequelize = require('sequelize');

module.exports = function (def) {
    var types = {
        string: def.size ? Sequelize.STRING(def.size) : Sequelize.STRING,
        text: Sequelize.TEXT,
        integer: Sequelize.INTEGER,
        float: Sequelize.FLOAT,
        date: Sequelize.DATE,
        datetime: Sequelize.DATE,
        boolean: Sequelize.BOOLEAN,
        binary: Sequelize.STRING.BINARY,
        array: Sequelize.ARRAY(Sequelize.TEXT),
        json: Sequelize.JSON,
        email: Sequelize.STRING
    };

    var attr = {};
    attr.type = types[def.type];

    if (def.hasOwnProperty('unique')) { attr.unique = def.unique; }
    if (def.defaultsTo) { attr.defaultValue = def.defaultsTo; }
    if (def.hasOwnProperty('required')) { attr.allowNull = !def.required; }
    if (def.hasOwnProperty('primaryKey')) { attr.primaryKey = def.primaryKey; }
    if (def.hasOwnProperty('autoIncrement')) { attr.autoIncrement = def.autoIncrement; }
    if (def.columnName) { attr.field = def.columnName; }
    if (def.enum) {
        _.extend(attr, {
            type: Sequelize.ENUM,
            values: def.enum
        });
    }

    return attr;
};