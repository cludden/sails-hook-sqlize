'use strict';

var _ = require('lodash');

module.exports = function(sails, Sequelize, config) {

    /**
     * Build a response object consisting of unique records
     *
     * @param {Object|String} parentModel - sails model object or identity
     * @param {Array|Object} resultSet - query result
     * @returns {Object} -response object consisting of sails model identity as keys
     *                      and a result set
     */
    function flatten(parentModel, resultSet) {

        var response = _flatten(parentModel, resultSet, {});

        // filter out empty models
        _.each(response, function(results, model) {
            if (!response[model].length) {
                delete response[model];
            }
        });

        // transform keys
        if (config.mapKeys) {
            response = _.mapKeys(response, config.mapKeys);
        }

        return response;
    }


    /**
     * Recursive function that flattens populated result sets
     *
     * @param {Object|String} parentModel - sails model or sails model identity
     * @param {Object[]} resultSet - populated result set
     * @param {[Object]} response - an already created response key to utilize
     * @returns {Object} - response object
     * @private
     */
    function _flatten(parentModel, resultSet, response) {

        response || (response = {});
        resultSet = _.isArray(resultSet) ? resultSet : [resultSet];

        // locate protected attributes
        var privateAttrs = _.keys(_.pick(parentModel._attributes, function(attr) {
            return attr.protected === true;
        }));

        // convert models to plain objects
        _.each(resultSet, function(record, i) {
            if (record.toJSON) {
                record = record.toJSON();
            }
            resultSet[i] = _.omit(record, privateAttrs);
        });

        // locate the applicable sails model
        var model = _.isString(parentModel) ? sails.models[parentModel] : parentModel;
        if (!model) {
            return void 0;
        }

        var modelName = model.adapter.identity,
            associations = model.associations;

        // iterate through this model's associations
        _.each(associations, function(association) {
            var type = association.type,
                alias = association.alias,
                childModelName = association[type],
                childModel = sails.models[childModelName],
                childRecords = [];

            // locate the child model
            if (!childModel) {
                return void 0;
            }

            // add a key to the response object for this childModel if it hasn't already
            // been added
            if (!response[childModelName]) {
                response[childModelName] = [];
            }

            // loop through the result set, extract any populated records and replace them
            // with their primary key
            _.each(resultSet, function(record) {
                if (record[alias] && _.isObject(record[alias])) {
                    var extracted = record[alias];
                    if (_.isArray(extracted)) {
                        childRecords = childRecords.concat(extracted);
                        record[alias] = _.pluck(childRecords, childModel.primaryKey);
                    } else {
                        childRecords.push(extracted);
                        record[alias] = extracted[childModel.primaryKey];
                    }
                }
            });

            // if any populated records were found, add them to the response key and
            // attempt to flatten them
            if (childRecords.length) {
                _flatten(childModel, childRecords, response);
            }

            // add initial result set on last iteration to ensure any
            // populated records have been replaced with their primary key
            if (associations.length - 1 === associations.indexOf(association)) {
                var primaryKey = sails.models[modelName].primaryKey;
                // search the current model's existing response for each of the resultSet's
                // models and merge in the resultSet model if found, otherwise push
                resultSet.forEach(function(currentResult) {
                    var foundResponse = _.find(response[modelName], function(currentResponse) {
                        return currentResponse[primaryKey] === currentResult[primaryKey];
                    });
                    if(foundResponse) {
                        _.merge(foundResponse, currentResult);
                    } else {
                        response[modelName].push(currentResult);
                    }
                });
            }
        });

        return response;
    }

    return flatten;
};