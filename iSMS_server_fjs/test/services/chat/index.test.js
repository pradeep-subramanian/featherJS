'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('chat service', function() {
  it('registered the chats service', () => {
    assert.ok(app.service('chats'));
  });
});
