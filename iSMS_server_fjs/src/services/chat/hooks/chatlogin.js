'use strict';

const path = require('path');
const encryption = require(path.resolve('./src/util/encryption'));

module.exports = function(options) {
  return function(hook) {
    // The authenticated user
    const user = hook.params.user;
    
    let encryptionConfig = hook.app.get('encryption');
    
    var password = new encryption(encryptionConfig.encryptionPassword).decrypt(user.chatSystemPassword);

    hook.params.chatUser = user.username;
    hook.params.chatPassword = password;
  };
};