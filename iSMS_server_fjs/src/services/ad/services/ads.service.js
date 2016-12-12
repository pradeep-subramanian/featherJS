'use strict';

var path = require('path'),
  queryFilters = require(path.resolve('./src/util/queryFilters')),
  repository = require(path.resolve('./src/dal/repository')),
  adRepository = new repository.Repository('Ad');

exports.create = function(entity) {
    return adRepository.create(entity);
};

exports.update = function(id, entity) {
    return adRepository.update(id, entity);
};

exports.remove = function(id) {
    return adRepository.remove(id);
};

exports.list = function(params) {
    var qf = queryFilters.create(params.query || {});
    return adRepository.findAll(qf.query, qf.filters, [{
      path: 'user',
      select: 'displayName' 
    }]);
};

exports.getItem = function(id) {
    return adRepository.findById(id, [{
      path: 'user',
      select: 'displayName' 
    }]);
};
