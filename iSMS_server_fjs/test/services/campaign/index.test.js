'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('campaign service', function() {
  it('registered the campaigns service', () => {
    assert.ok(app.service('campaigns'));
  });
});
