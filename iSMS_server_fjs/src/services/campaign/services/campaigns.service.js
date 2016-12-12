'use strict';

var path = require('path'),
  queryFilters = require(path.resolve('./src/util/queryFilters')),
  repository = require(path.resolve('./src/dal/repository')),
  campaignRepository = new repository.Repository('Campaign');

exports.create = function(entity) {
    return campaignRepository.create(entity);
};

exports.update = function(id, entity) {
    return campaignRepository.update(id, entity);
};

exports.remove = function(id) {
    return campaignRepository.remove(id);
};

exports.list = function(params) {
    var qf = queryFilters.create(params.query || {});
    return campaignRepository.findAll(qf.query, qf.filters, [{
      path: 'user',
      select: 'displayName' 
    }, {
        path: 'advertisement',
        select: 'name'
    }]);
};

exports.getItem = function(id) {
    return campaignRepository.findById(id, [{
      path: 'user',
      select: 'displayName' 
    }, {
        path: 'advertisement',
        select: 'name'
    }]);
};
