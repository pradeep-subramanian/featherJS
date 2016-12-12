'use strict';

const url = require('url');
const cache = require('memory-cache');
const DDPClient = require('ddp');
const DDPLogin = require('ddp-login');
const path = require('path');
const encryption = require(path.resolve('./src/util/encryption'));

module.exports = function(options) {
  return function(hook) {
    
    // The authenticated user
    const user = hook.result;
    
    var username = user.username;
    var cacheKey = username + '_rocketchatddp';
    var ddpConnection = cache.get(cacheKey);

    if (ddpConnection) {
        return;
    }

    let encryptionConfig = hook.app.get('encryption');
    var password = new encryption(encryptionConfig.encryptionPassword).decrypt(user.chatSystemPassword);

    let chatConfig = hook.app.get('rocketchat');
    var parts = url.parse(chatConfig.serverEndpoint);
    
    ddpConnection = new DDPClient({
        host: parts.hostname,
        port: parts.port,
        ssl: 'http' === parts.protocol,
        autoReconnectTimer: 500,
        maintainCollections: true,
        ddpVersion: '1',
        useSockJs: false
    });
    ddpConnection.connect(function(error, wasReconnect){
        if (error){
            console.log(username + ' DDP client connection error: ' + error);
            return;
        }

        console.log(username + ' DDP client connection success.');
        console.log(username + ' Was reconnect = ' + wasReconnect);

        DDPLogin.loginWithUsername(ddpConnection, username, password, function(err, userInfo) {
            if (err) {
                console.log(username + ' failed to login to chat server via DDP!');
                return;
            }

            if (!wasReconnect) {
                console.log(username + ' saved ddp connection to cache');
                cache.put(cacheKey, ddpConnection);
            }
        });
    });
  };
};