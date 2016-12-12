'use strict';

var path = require('path'),
    repository = require(path.resolve('./src/dal/repository')),
    userservice = require(path.resolve('./src/services/user/services/users.service.js'));


var chai = require('chai'),
  sinon = require('sinon'),
  expect = chai.expect;
chai.should();

describe('Test CRUD function for users service', function() {
    it('To create an entity', function() {
      var repositoryStub = sinon.stub(repository);
      repositoryStub.
      userservice.create();
    });
  });