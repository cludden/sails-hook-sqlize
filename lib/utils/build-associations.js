/**
 *  Associate sequelize models with one another based on the associations
 *  defined in the sails model definitions
 */

'use strict';

var _ = require('lodash');

module.exports = function(sails) {
    var log = require('./log')(sails);

    return function(cb) {
        var models = {};

        // gather all associations
        _.each(_.keys(sails.sequelize), function(name) {
            var def = sails.models[name];
            models[name] = _.pick(def.attributes, function(attr) {
                return attr.collection || attr.model;
            });
        });

        // iterate through sequelize models
        _.each(models, function(associations, name) {
            var model = sails.sequelize[name];

            // iterate through each association for the current model
            _.each(associations, function(association, alias) {

                // gather required association and reverse association info
                var type = association.collection ? 'collection' : 'model',
                    childName = association[type],
                    childModel = sails.sequelize[childName];

                // skip associations with different connections, this is not supported by sequelize
                if (sails.models[name].connection !== sails.models[childName].connection) { return void 0; }

                // otherwise, continue gathering requirements
                var childAlias = _.findKey(models[childName], function(childAssociation) {
                        if (childAssociation.collection) {
                            return childAssociation.collection === name && childAssociation.via === alias;
                        } else {
                            return childAssociation.model === name;
                        }
                    }),
                    childAssociation = models[childName][childAlias],
                    childType = childAssociation.collection ? 'collection' : 'model';

                // build the association
                var foreignKey;
                if (type === 'model') {
                    // belongs to
                    foreignKey = association.columnName || alias;
                    model.belongsTo(childModel, {foreignKey: foreignKey, as: alias});
                    log('silly', 'Registered association: `' + name + '` belongsTo `' + childName + '` as ' + alias);
                } else if (childType === 'collection') {
                    // belongs to many
                    foreignKey = name + '_' + alias;
                    var otherKey = childName + '_' + childAlias,
                        pieces = [foreignKey, otherKey].sort(),
                        joinTable = pieces.join('__');

                    model.belongsToMany(childModel, {
                        foreignKey: foreignKey,
                        otherKey: otherKey,
                        through: joinTable,
                        as: alias});
                    log('silly', 'Registered association: `' + name + '` belongsToMany `' + childName +
                        '` as \'' + alias + '\' with fk: \'' + foreignKey + '\' through \'' + joinTable + '\'');
                } else { // type === 'model'
                    // has many
                    foreignKey = childAssociation.columnName || childAlias;
                    model.hasMany(childModel, {foreignKey: foreignKey, as: alias});
                    log('silly', 'Registered association: `' + name + '` hasMany `' + childName +
                        '` as \'' + alias + '\'');
                }
            });
        });

        cb();
    }
};