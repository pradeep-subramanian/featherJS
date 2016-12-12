'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('ad service', function() {
  it('registered the ads service', () => {
    assert.ok(app.service('ads'));
  });
});
