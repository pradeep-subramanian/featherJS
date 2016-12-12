'use strict';

const keyword = require('./models/keyword.model');
const controller = require('./controllers/keywords.controller');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {};

  // Initialize our service with any options it requires
  app.use('/api/v1/keywords', new controller(options));

  // Get our initialize service to that we can bind hooks
  const keywordService = app.service('/api/v1/keywords');

  // Set up our before hooks
  keywordService.before(hooks.before);

  // Set up our after hooks
  keywordService.after(hooks.after);
};
