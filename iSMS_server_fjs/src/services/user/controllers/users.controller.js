/*
'use strict';

const path = require('path');
const generatePassword = require('password-generator');
const service = require('../services/users.service');
const chatSystem = require('../../rocketchat/rocketchatservice');
const encryption = require(path.resolve('./src/util/encryption'));

module.exports = function(options) {
    const self = this;

    self.options = options || {};
    self.find = find;
    self.get = get;
    self.create = create;
    self.update = update;
    self.remove = remove;

    function find(params) {
        return service.list(params);
    }

    function get(id, params){
        return service.getItem(id);
    }

    function create(data, params) {
       return service.create(data);
    }

    function update(id, data, params) {
        return service.update(id, data);
    }

    function remove(id, params) {
        return service.remove(id);
    }
};
*/





/* Code below is original but does not allow me to get the token properly */
'use strict';

const path = require('path');
const generatePassword = require('password-generator');
const service = require('../services/users.service');
const chatSystem = require('../../rocketchat/rocketchatservice');
const encryption = require(path.resolve('./src/util/encryption'));
const unirest = require('unirest');

function validateFacebookToken(data) {
  var requestURL = 'https://graph.facebook.com/me?access_token=' + data.accessToken;
  console.log('validateFacebookToken---->');
  console.log(data.accessToken);
  return new Promise((resolve, reject) => {
    unirest.post(requestURL)
      .header("Content-Type", "application/json")
      .end(function (response) {
        var responseData = response.body;
        if (response.status < 200 && response.status > 299) {
          var error = new Error("Communication to iSMS server failed.");
          reject(error);
          return;
        }
        resolve(responseData);
      });
  });
}

module.exports = function(options) {
    const self = this;

    self.options = options || {};
    self.find = find;
    self.get = get;
    self.create = create;
    self.update = update;
    self.remove = remove;

    function find(params) {
        return service.list(params);
    }

    function get(id, params){
        return service.getItem(id);
    }

    function create(data, params) {
        /*var password = generatePassword(16, true);
        var encryptedPassword = new encryption(self.options.encryptionPassword).encrypt(password);
        var chatServer = new chatSystem({
            serverEndpoint: self.options.serverEndpoint
        });

        data.chatSystemPassword = encryptedPassword;

        var logon = function() {
            return chatServer.logon(self.options.chatAdminUser, self.options.chatAdminPassword);
        };

        var registerUser = function(token) {
            return chatServer.registerUser(token, data.username, data.email, password)
                .then(() => chatServer.logout(token));
        };*/

        var createUser = function() {
            if (data.provider == 'facebook') {
                return validateFacebookToken(data).then(function(res){
                console.log("-------resresresresres--------");
                console.log(res);
                return res;
            });
            }else{
                return service.create(data);
            }
        };

        /*return logon()
            .then(registerUser)
            .then(createUser);*/

        return createUser();

            
    }

    function update(id, data, params) {

        if (data.provider == 'facebook') {
            return validateFacebookToken(data).then(function(res){
            console.log("-------resresresresres--------");
            console.log(res);
            return res;
        });

        }
        console.log("-------Im updating the profile--------");
        if(data.action=='EditProfile'){
            var params = {
                'username': id
            };
            return find(params).then(function(res){
                return service.update(res[0]._id, data).catch(function(err) {
                    console.log(err);
                });
            }).catch(function(reason) {
                console.log("-------Reason--------");
                console.log(reason);
                res.status(400).send(reason);
            });
        }else{
            return service.update(id, data);
        }
    }

    function remove(id, params) {
        return service.remove(id);
    }
};