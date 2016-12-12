'use strict';

var service = require('../services/campaigns.service');

module.exports = function(options) {
    var self = this;

    self.options = options || {};
    self.find = find;
    self.get = get;
    self.create = create;
    self.update = update;
    self.remove = remove;

    function find(params) {
        return service.list(params);
    }

    function get(id){
        return service.getItem(id);
    }

    function create(data) {
        return service.create(data);
    }

    function update(id, data, param) {
        return service.update(id, data);
    }

    function remove(id, params) {
        return service.remove(id);
    }
};
