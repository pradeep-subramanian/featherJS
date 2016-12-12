'use strict';

var path = require('path'),
  queryFilters = require(path.resolve('./src/util/queryFilters')),
  repository = require(path.resolve('./src/dal/repository')),
  userRepository = new repository.Repository('User');

exports.create = function(entity) {
    return userRepository.create(entity);
};

exports.update = function(id, entity) {
    return userRepository.update(id, entity);
};

exports.remove = function(id) {
    return userRepository.remove(id);
};

exports.list = function(params) {
    var qf = queryFilters.create(params.query || {});
    return userRepository.findAll(qf.query, qf.filters);
};

exports.getItem = function(id) {
    return userRepository.findById(id);
};
