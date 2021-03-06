'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const chatddpconnect = require('./chatddpconnect');

exports.before = {
  all: [],
  find: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated()
  ],
  get: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    auth.restrictToOwner({ ownerField: '_id' })
  ],
  create: [],
  update: [
    //auth.verifyToken(),
    //auth.populateUser(),
    //auth.restrictToAuthenticated(),
    //auth.restrictToOwner({ ownerField: '_id' })
  ],
  patch: [
    //auth.verifyToken(),
    //auth.populateUser(),
    //auth.restrictToAuthenticated(),
    //auth.restrictToOwner({ ownerField: '_id' })
  ],
  remove: [
    //auth.verifyToken(),
    //auth.populateUser(),
    //auth.restrictToAuthenticated(),
    //auth.restrictToOwner({ ownerField: '_id' })
  ]
};

exports.after = {
  all: [
    hooks.remove('password', 'salt', 'chatSystemPassword')
  ],
  find: [],
  get: [],//[chatddpconnect()],
  create: [],
  update: [],
  patch: [],
  remove: []
};
