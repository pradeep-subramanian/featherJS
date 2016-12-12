'use strict';

const globalHooks = require('../../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const chatlogin = require('../chatlogin');

exports.before = {
  all: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    chatlogin()
  ],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
