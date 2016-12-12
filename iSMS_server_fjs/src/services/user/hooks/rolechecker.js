'use strict';

const url = require('url');
const cache = require('memory-cache');
const DDPClient = require('ddp');
const DDPLogin = require('ddp-login');
const path = require('path');
const encryption = require(path.resolve('./src/util/encryption'));
const hooks = require('feathers-hooks');

module.exports = function(options) {
  return function(hook) {
    console.log('My custom global hook ran. Feathers is awesomee!!!!!!!!');
    console.log(hook.params);
  };
};