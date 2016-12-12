'use strict';

const _ = require('underscore');
const unirest = require('unirest');
const errors = require('feathers-errors');

module.exports = function(options) {
    const self = this;

    self.options = options || {};

    self.logon = logon;
    self.logout = logout;
    self.registerUser = registerUser;
    self.getPublicRooms = getPublicRooms;
    self.getPublicRoom = getPublicRoom;
    self.createPublicRoom = createPublicRoom;
    self.deletePublicRoom = deletePublicRoom;
    self.joinPublicRoom = joinPublicRoom;
    self.leavePublicRoom = leavePublicRoom;
    self.getPublicRoomMessages = getPublicRoomMessages;
    self.sendPublicRoomMessage = sendPublicRoomMessage;
    self.getPrivateRooms = getPrivateRooms;
    self.getPrivateRoom = getPrivateRoom;
    self.createPrivateRoom = createPrivateRoom;
    self.deletePrivateRoom = deletePrivateRoom;
    self.addUserToPrivateRoom = addUserToPrivateRoom;
    self.removeUserFromPrivateRoom = removeUserFromPrivateRoom;
    self.getPrivateRoomMessages = getPrivateRoomMessages;
    self.sendPrivateRoomMessage = sendPrivateRoomMessage;

    function logon (user, password) {
        var requestURL = self.options.serverEndpoint + '/api/login';
        var requestData = {
            user: user,
            password: password
        };
        
        return new Promise((resolve, reject) => {
            unirest.post(requestURL)
                .send(requestData)
                .end(function(response) {
                    if (response.status != 200) {
                        var error = new errors.GeneralError("Communication to chat server failed.");
                        reject(error);
                        return;
                    } 
                    
                    var responseData = response.body;

                    if (responseData.status !== "success") {
                        var error = new errors.GeneralError(responseData.message);
                        reject(error);
                        return;
                    }

                    resolve(responseData.data);
                });
        });
    }

    function logout(token) {
        var requestURL = self.options.serverEndpoint + '/api/logout';
        
        return new Promise((resolve, reject) => {
            unirest.post(requestURL)
            .header("X-Auth-Token", token.authToken)
            .header("X-User-Id", token.userId)
            .end(function(response) {
                    if (response.status != 200) {
                        var error = new errors.GeneralError("Communication to chat server failed.");
                        reject(error);
                        return;
                    } 
                    
                    var responseData = response.body;

                    if (responseData.status !== "success") {
                        var error = new errors.GeneralError(responseData.message);
                        reject(error);
                        return;
                    }

                    resolve(responseData.status);
                });
        });
    }

    function getPublicRooms(token) {
        var requestURL = self.options.serverEndpoint + '/api/publicRooms';
        
        return new Promise((resolve, reject) => {
            unirest.get(requestURL)
                .header("X-Auth-Token", token.authToken)
                .header("X-User-Id", token.userId)
                .end(function(response) {
                    if (response.status != 200) {
                        var error = new errors.GeneralError("Communication to chat server failed.");
                        reject(error);
                        return;
                    } 
                    
                    var responseData = response.body;

                    if (responseData.status !== "success") {
                        var error = new errors.GeneralError(responseData.message);
                        reject(error);
                        return;
                    }
                    
                    var results = _.map(responseData.rooms, function (row) {
                        return _.omit(row, ['t', 'ts', 'usernames', 'msgs', 'u', 'lm']);
                    });

                    resolve(results);
                });
        });
    }

    function getPublicRoom(token, roomName) {
        var requestURL = self.options.serverEndpoint + '/api/publicRooms';
        
        return new Promise((resolve, reject) => {
            unirest.get(requestURL)
                .header("X-Auth-Token", token.authToken)
                .header("X-User-Id", token.userId)
                .end(function(response) {
                    if (response.status != 200) {
                        var error = new errors.GeneralError("Communication to chat server failed.");
                        reject(error);
                        return;
                    } 
                    
                    var responseData = response.body;

                    if (responseData.status !== "success") {
                        var error = new errors.GeneralError(responseData.message);
                        reject(error);
                        return;
                    }
                    
                    var result = _.find(responseData.rooms, function(obj) {
                        return obj.name === roomName;
                    });

                    resolve(result);
                });
        });
    }

    function createPublicRoom(token, roomName) {
        var requestURL = self.options.serverEndpoint + '/api/publicRooms';
        var room = {
            name: roomName
        };

        return new Promise((resolve, reject) => {
            unirest.post(requestURL)
                .header("X-Auth-Token", token.authToken)
                .header("X-User-Id", token.userId)
                .send(room)
                .end(function(response) {
                    if (response.status != 200) {
                        var error = new errors.GeneralError("Communication to chat server failed.");
                        reject(error);
                        return;
                    } 
                    
                    var responseData = response.body;

                    if (responseData.status !== "success") {
                        var error = new errors.GeneralError(responseData.message);
                        reject(error);
                        return;
                    }

                    resolve(responseData.status);
                });
        });
    }

    function deletePublicRoom(token, roomId) {
        var requestURL = self.options.serverEndpoint + '/api/publicRooms';
        var room = {
            id: roomId
        };

        return new Promise((resolve, reject) => {
            unirest.delete(requestURL)
                .header("X-Auth-Token", token.authToken)
                .header("X-User-Id", token.userId)
                .send(room)
                .end(function(response) {
                    if (response.status != 200) {
                        var error = new errors.GeneralError("Communication to chat server failed.");
                        reject(error);
                        return;
                    } 
                    
                    var responseData = response.body;

                    if (responseData.status !== "success") {
                        var error = new errors.GeneralError(responseData.message);
                        reject(error);
                        return;
                    }

                    resolve(responseData.status);
                });
        });
    }

    function joinPublicRoom(token, roomId) {
        var requestURL = self.options.serverEndpoint + '/api/rooms/' + roomId + '/join';

        return new Promise((resolve, reject) => {
            unirest.post(requestURL)
                .header("X-Auth-Token", token.authToken)
                .header("X-User-Id", token.userId)
                .end(function(response) {
                    if (response.status != 200) {
                        var error = new errors.GeneralError("Communication to chat server failed.");
                        reject(error);
                        return;
                    } 
                    
                    var responseData = response.body;

                    if (responseData.status !== "success") {
                        var error = new errors.GeneralError(responseData.message);
                        reject(error);
                        return;
                    }

                    resolve(responseData.status);
                });
        });
    }

    function leavePublicRoom(token, roomId) {
        var requestURL = self.options.serverEndpoint + '/api/rooms/' + roomId + '/leave';

        return new Promise((resolve, reject) => {
            unirest.post(requestURL)
                .header("X-Auth-Token", token.authToken)
                .header("X-User-Id", token.userId)
                .end(function(response) {
                    if (response.status != 200) {
                        var error = new errors.GeneralError("Communication to chat server failed.");
                        reject(error);
                        return;
                    } 
                    
                    var responseData = response.body;

                    if (responseData.status !== "success") {
                        var error = new errors.GeneralError(responseData.message);
                        reject(error);
                        return;
                    }

                    resolve(responseData.status);
                });
        });
    }

    function getPublicRoomMessages(token, roomName, roomId) {
        var requestURL = self.options.serverEndpoint + '/api/rooms/' + roomId + '/messages';

        return new Promise((resolve, reject) => {
            unirest.get(requestURL)
                .header("X-Auth-Token", token.authToken)
                .header("X-User-Id", token.userId)
                .end(function(response) {
                    if (response.status != 200) {
                        var error = new errors.GeneralError("Communication to chat server failed.");
                        reject(error);
                        return;
                    } 
                    
                    var responseData = response.body;

                    if (responseData.status !== "success") {
                        var error = new errors.GeneralError(responseData.message);
                        reject(error);
                        return;
                    }

                    var filtered = _.filter(responseData.messages, function(row) {
                        return row.t != 'uj' && row.t != 'ul' && row.t != 'au' && row.t != 'ru';
                    });
                    
                    var results = _.map(filtered, function (row) {
                        var newMsg = {
                            room: roomName,
                            timestamp: row.ts,
                            user: row.u.username,
                            message: row.msg
                        };

                        if (row.urls) {
                            newMsg.urls = row.urls;
                        }

                        if (row.file) {
                            newMsg.file = row.file;
                        }

                        if (row.attachments) {
                            newMsg.attachments = row.attachments;
                        }
                        
                        return newMsg;
                    });

                    resolve(results);
                });
        });
    }

    function sendPublicRoomMessage(token, roomId, message) {
        var requestURL = self.options.serverEndpoint + '/api/rooms/' + roomId + '/send';

        return new Promise((resolve, reject) => {
            unirest.post(requestURL)
                .header("X-Auth-Token", token.authToken)
                .header("X-User-Id", token.userId)
                .send({ msg: message})
                .end(function(response) {
                    if (response.status != 200) {
                        var error = new errors.GeneralError("Communication to chat server failed.");
                        reject(error);
                        return;
                    } 
                    
                    var responseData = response.body;

                    if (responseData.status !== "success") {
                        var error = new errors.GeneralError(responseData.message);
                        reject(error);
                        return;
                    }

                    resolve(responseData.status);
                });
        });
    }

    function getPrivateRooms(token) {
        var requestURL = self.options.serverEndpoint + '/api/privateRooms';
        
        return new Promise((resolve, reject) => {
            unirest.get(requestURL)
                .header("X-Auth-Token", token.authToken)
                .header("X-User-Id", token.userId)
                .end(function(response) {
                    if (response.status != 200) {
                        var error = new errors.GeneralError("Communication to chat server failed.");
                        reject(error);
                        return;
                    } 
                    
                    var responseData = response.body;

                    if (responseData.status !== "success") {
                        var error = new errors.GeneralError(responseData.message);
                        reject(error);
                        return;
                    }
                    
                    var results = _.map(responseData.rooms, function (row) {
                        return _.omit(row, ['t', 'ts', 'usernames', 'msgs', 'u','lm']);
                    });

                    resolve(results);
                });
        });
    }

    function getPrivateRoom(token, roomName) {
        var requestURL = self.options.serverEndpoint + '/api/privateRooms';
        
        return new Promise((resolve, reject) => {
            unirest.get(requestURL)
                .header("X-Auth-Token", token.authToken)
                .header("X-User-Id", token.userId)
                .end(function(response) {
                    if (response.status != 200) {
                        var error = new errors.GeneralError("Communication to chat server failed.");
                        reject(error);
                        return;
                    } 
                    
                    var responseData = response.body;

                    if (responseData.status !== "success") {
                        var error = new errors.GeneralError(responseData.message);
                        reject(error);
                        return;
                    }
                    
                    var result = _.find(responseData.rooms, function(obj) {
                        return obj.name === roomName;
                    });

                    resolve(result);
                });
        });
    }

    function createPrivateRoom(token, roomName) {
        var requestURL = self.options.serverEndpoint + '/api/privateRooms';
        var room = {
            name: roomName
        };

        return new Promise((resolve, reject) => {
            unirest.post(requestURL)
                .header("X-Auth-Token", token.authToken)
                .header("X-User-Id", token.userId)
                .send(room)
                .end(function(response) {
                    if (response.status != 200) {
                        var error = new errors.GeneralError("Communication to chat server failed.");
                        reject(error);
                        return;
                    } 
                    
                    var responseData = response.body;

                    if (responseData.status !== "success") {
                        var error = new errors.GeneralError(responseData.message);
                        reject(error);
                        return;
                    }

                    resolve(responseData.status);
                });
        });
    }

    function deletePrivateRoom(token, roomId) {
        var requestURL = self.options.serverEndpoint + '/api/privateRooms';
        var room = {
            id: roomId
        };

        return new Promise((resolve, reject) => {
            unirest.delete(requestURL)
                .header("X-Auth-Token", token.authToken)
                .header("X-User-Id", token.userId)
                .send(room)
                .end(function(response) {
                    if (response.status != 200) {
                        var error = new errors.GeneralError("Communication to chat server failed.");
                        reject(error);
                        return;
                    } 
                    
                    var responseData = response.body;

                    if (responseData.status !== "success") {
                        var error = new errors.GeneralError(responseData.message);
                        reject(error);
                        return;
                    }

                    resolve(responseData.status);
                });
        });
    }

    function addUserToPrivateRoom(token, roomId, username) {
        var requestURL = self.options.serverEndpoint + '/api/rooms/' + roomId + '/users';
        var data = {
            username: username
        };

        return new Promise((resolve, reject) => {
            unirest.post(requestURL)
                .header("X-Auth-Token", token.authToken)
                .header("X-User-Id", token.userId)
                .send(data)
                .end(function(response) {
                    if (response.status != 200) {
                        var error = new errors.GeneralError("Communication to chat server failed.");
                        reject(error);
                        return;
                    } 
                    
                    var responseData = response.body;

                    if (responseData.status !== "success") {
                        var error = new errors.GeneralError(responseData.message);
                        reject(error);
                        return;
                    }

                    resolve(responseData.status);
                });
        });
    }

    function removeUserFromPrivateRoom(token, roomId, username) {
        var requestURL = self.options.serverEndpoint + '/api/rooms/' + roomId + '/users';
        var data = {
            username: username
        };

        return new Promise((resolve, reject) => {
            unirest.delete(requestURL)
                .header("X-Auth-Token", token.authToken)
                .header("X-User-Id", token.userId)
                .send(data)
                .end(function(response) {
                    if (response.status != 200) {
                        var error = new errors.GeneralError("Communication to chat server failed.");
                        reject(error);
                        return;
                    } 
                    
                    var responseData = response.body;

                    if (responseData.status !== "success") {
                        var error = new errors.GeneralError(responseData.message);
                        reject(error);
                        return;
                    }

                    resolve(responseData.status);
                });
        });
    }

    function getPrivateRoomMessages(token, roomName, roomId) {
        var requestURL = self.options.serverEndpoint + '/api/rooms/' + roomId + '/messages';

        return new Promise((resolve, reject) => {
            unirest.get(requestURL)
                .header("X-Auth-Token", token.authToken)
                .header("X-User-Id", token.userId)
                .end(function(response) {
                    if (response.status != 200) {
                        var error = new errors.GeneralError("Communication to chat server failed.");
                        reject(error);
                        return;
                    } 
                    
                    var responseData = response.body;

                    if (responseData.status !== "success") {
                        var error = new errors.GeneralError(responseData.message);
                        reject(error);
                        return;
                    }

                    var filtered = _.filter(responseData.messages, function(row) {
                        return row.t != 'uj' && row.t != 'ul' && row.t != 'au' && row.t != 'ru';
                    });
                    
                    var results = _.map(filtered, function (row) {
                        var newMsg = {
                            room: roomName,
                            timestamp: row.ts,
                            user: row.u.username,
                            message: row.msg
                        };

                        if (row.urls) {
                            newMsg.urls = row.urls;
                        }

                        if (row.file) {
                            newMsg.file = row.file;
                        }

                        if (row.attachments) {
                            newMsg.attachments = row.attachments;
                        }

                        return newMsg;
                    });

                    resolve(results);
                });
        });
    }

    function sendPrivateRoomMessage(token, roomId, message) {
        var requestURL = self.options.serverEndpoint + '/api/rooms/' + roomId + '/send';

        return new Promise((resolve, reject) => {
            unirest.post(requestURL)
                .header("X-Auth-Token", token.authToken)
                .header("X-User-Id", token.userId)
                .send({ msg: message})
                .end(function(response) {
                    if (response.status != 200) {
                        var error = new errors.GeneralError("Communication to chat server failed.");
                        reject(error);
                        return;
                    } 
                    
                    var responseData = response.body;

                    if (responseData.status !== "success") {
                        var error = new errors.GeneralError(responseData.message);
                        reject(error);
                        return;
                    }

                    resolve(responseData.status);
                });
        });
    }

    function registerUser(token, userName, userEmail, password) {
        var _this = this;
        var requestURL = self.options.serverEndpoint + '/api/bulk/register';
        
        var data = {
                users: [ {email: userEmail,
                        name: userName,
                        pass: password} ]
                };
        
        return new Promise((resolve, reject) => {
            unirest.post(requestURL)
                .header("X-Auth-Token", token.authToken)
                .header("X-User-Id", token.userId)
                .header("Content-Type", "application/json")
                .send(JSON.stringify(data))
                .end(function(response) {
                    if (response.status != 200) {
                        var error = new errors.GeneralError("Communication to chat server failed.");
                        reject(error);
                        return;
                    } 
                    
                    var responseData = response.body;

                    if (responseData.status !== "success") {
                        var error = new errors.GeneralError(responseData.message);
                        reject(error);
                        return;
                    }

                    resolve(responseData.status);
                });
        });
                        
    }
};



