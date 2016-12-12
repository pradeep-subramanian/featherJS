'use strict';

var path = require('path'),
  queryFilters = require(path.resolve('./src/util/queryFilters')),
  repository = require(path.resolve('./src/dal/repository')),
  keywordRepository = new repository.Repository('Keyword');

exports.create = function(entity) {
    return keywordRepository.create(entity);
};

exports.update = function(id, entity) {
    return keywordRepository.update(id, entity);
};

exports.remove = function(id) {
    return keywordRepository.remove(id);
};

exports.list = function(params) {
    var qf = queryFilters.create(params.query || {});
    return keywordRepository.findAll(qf.query, qf.filters, [{
      path: 'user',
      select: 'displayName' 
    }]);
};

exports.getItem = function(id) {
    return keywordRepository.findById(id, [{
      path: 'user',
      select: 'displayName' 
    }]);
};
