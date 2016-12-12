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
            return chatServer.getPublicRoom(token, params.room_name)
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
        var username = params.user.username;

        var logon = function() {
            return chatServer.logon(params.chatUser, params.chatPassword);
        };

        var joinPublicRoom = function(token) {
            return chatServer.getPublicRoom(token, params.room_name)
                .then((room) => {
                    return chatServer.joinPublicRoom(token, room._id)
                        .then((data) => {
                            chatServer.logout(token);
                            return username;
                        });
                });
        };

        return logon()
            .then(joinPublicRoom);
    }

    function remove(id, params) {
        var chatServer = new rocketchat({
            serverEndpoint: self.options.serverEndpoint
        });
        var username = params.user.username;

        var logon = function() {
            return chatServer.logon(params.chatUser, params.chatPassword);
        };

        var leavePublicRoom = function(token) {
            return chatServer.getPublicRoom(token, params.room_name)
                .then((room) => {
                    return chatServer.leavePublicRoom(token, room._id)
                        .then((data) => {
                            chatServer.logout(token);
                            return username;
                        });
                });
        };

        return logon()
            .then(leavePublicRoom);
    }
};
