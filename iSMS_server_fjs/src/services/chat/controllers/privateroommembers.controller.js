'use strict';

const rocketchat = require('../../rocketchat/rocketchatservice');
const errors = require('feathers-errors');

module.exports = function(options) {
    var self = this;

    self.options = options || {};
    self.find = find;
    self.create = create;
    self.remove = remove;

    function find(params) {
        var chatServer = new rocketchat({
            serverEndpoint: self.options.serverEndpoint
        });

        var logon = function() {
            return chatServer.logon(params.chatUser, params.chatPassword);
        };

        var getMembers = function(token) {
            return chatServer.getPrivateRoom(token, params.room_name)
                .then((data) => {
                    console.log(data);
                    chatServer.logout(token);
                    return data.usernames;
                });
        };

        return logon()
            .then(getMembers);
    }

    function create(data, params) {
        var chatServer = new rocketchat({
            serverEndpoint: self.options.serverEndpoint
        });
        var username = data.username;

        var logon = function() {
            return chatServer.logon(params.chatUser, params.chatPassword);
        };

        var addUserToRoom = function(token) {
            return chatServer.getPrivateRoom(token, params.room_name)
                .then((room) => {
                    return chatServer.addUserToPrivateRoom(token, room._id, username)
                        .then((data) => {
                            chatServer.logout(token);
                            return username;
                        });
                });
        };

        return logon()
            .then(addUserToRoom);
    }

    function remove(id, params) {
        var chatServer = new rocketchat({
            serverEndpoint: self.options.serverEndpoint
        });
        var username = id;

        var logon = function() {
            return chatServer.logon(params.chatUser, params.chatPassword);
        };

        var removeUserFromRoom = function(token) {
            return chatServer.getPrivateRoom(token, params.room_name)
                .then((room) => {
                    return chatServer.removeUserFromPrivateRoom(token, room._id, username)
                        .then((data) => {
                            chatServer.logout(token);
                            return username;
                        });
                });
        };

        return logon()
            .then(removeUserFromRoom);
    }
};
