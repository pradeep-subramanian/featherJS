'use strict';

const ad = require('./models/ad.model');
const controller = require('./controllers/ads.controller');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {};

  // Initialize our service with any options it requires
  app.use('/api/v1/ads', new controller(options));

  // Get our initialize service to that we can bind hooks
  const adService = app.service('/api/v1/ads');

  // Set up our before hooks
  adService.before(hooks.before);

  // Set up our after hooks
  adService.after(hooks.after);
};
