'use strict';

const campaign = require('./models/campaign.model');
const controller = require('./controllers/campaigns.controller');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {};

  // Initialize our service with any options it requires
  app.use('/api/v1/campaigns', new controller(options));

  // Get our initialize service to that we can bind hooks
  const campaignService = app.service('/api/v1/campaigns');

  // Set up our before hooks
  campaignService.before(hooks.before);

  // Set up our after hooks
  campaignService.after(hooks.after);
};
