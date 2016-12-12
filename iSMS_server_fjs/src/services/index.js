'use strict';
const campaign = require('./campaign');
const ad = require('./ad');
const keyword = require('./keyword');
const chat = require('./chat');
const authentication = require('./authentication');
const user = require('./user');
const mongoose = require('mongoose');

module.exports = function() {
  const app = this;

  mongoose.connect(app.get('mongodb'));
  mongoose.Promise = global.Promise;

  app.configure(authentication);
  app.configure(user);
  app.configure(chat);
  app.configure(ad);
  app.configure(campaign);
  app.configure(keyword);
};
