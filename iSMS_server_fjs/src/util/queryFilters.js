'use strict';

const omit = require('lodash.omit');
const PROPERTIES = ['$sort', '$limit', '$skip', '$select', '$populate'];

exports.create = function (query) {
    var filters = {
        $sort: query.$sort,
        $select: query.$select,
        $populate: query.$populate
    };

    if(typeof query.$skip !== 'undefined') {
        filters.$skip = parseInt(query.$skip);
    }

    if(typeof query.$limit !== 'undefined') {
        filters.$limit = parseInt(query.$limit);
    } 

    var results = { filters: filters, query: omit(query, ...PROPERTIES) };
    return results;
};
