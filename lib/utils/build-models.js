/*
 *  Define a sequelize model using a sails model
 */

'use strict';

var _ = require('lodash'),
    mapAttribute = require('./map-datatypes');

module.exports = function(sails) {
    var whitelist = ['timestamps', 'freezeTableName', 'paranoid', 'underscored',
        'tableName', 'createdAt', 'updatedAt', 'deletedAt', 'engine', 'comment'],
        log = require('./log')(sails);

    return function(cb, data){
        // create container for reference throughout app modules
        if (sails.sequelize) { return fn('sails.sequelize already exists'); }
        sails.sequelize = {};

        var defaultConnection = sails.config.models.connection;
        _.each(sails.models, function(model, name) {
            // only create a sequelize definition if the model connection is specified
            // in the sequelize config
            var modelConnection = model.connection || defaultConnection;
            if (!data.connections[modelConnection]) { return void 0; }

            // locate all required data
            var def = model.sequelize || {},
                tableName = model.tableName || model.identity,
                schema = def.schemaName || model.schemaName,
                defaults = sails.config.sequelize.defaults,
                options = _.defaults(_.extend(model.sequelize || {}, _.pick(def, whitelist)), defaults),
                sequelize = data.connections[modelConnection];

            // skip if no sequelize connection found
            if (!sequelize) { return void 0; }

            // add freezeTableName to options if tableName specified
            if (model.tableName) { options.freezeTableName = true }

            // grab model definition components from sails
            var instanceMethods = _.pick(model.attributes, _.functions(model.attributes)),
                classMethods = _.pick(model, _.functions(model)),
                attributes = _.omit(model.attributes, _.functions(model.attributes));

            // augment options
            options.instanceMethods = instanceMethods;
            options.classMethods = classMethods;

            // extract associations from attributes
            var associations = {};
            _.each(attributes, function(attr, name) {
                if (!attr.collection && !attr.model) {
                    attributes[name] = mapAttribute(attr);
                } else {
                    if (!def.associations || !def.associations[name]) {
                        associations[name] = attr;
                    }
                    delete attributes[name];
                }
            });

            // convert attribute definitions from sails to sequelize
            attributes = _.extend(attributes, def.attributes || {});
            var Model = sequelize.define(tableName, attributes, options);
            if (schema) { Model.schema(schema); }
            log('silly', 'Registering model `' + name + '` in Sequelize (ORM)');
            sails.sequelize[name] = Model;
        });
        cb();
    }
};