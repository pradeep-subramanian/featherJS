'use strict';

const rocketchat = require('../../rocketchat/rocketchatservice');
const errors = require('feathers-errors');

module.exports = function(options) {
    var self = this;

    self.options = options || {};
    self.find = find;
    self.create = create;

    function find(params) {
        var chatServer = new rocketchat({
            serverEndpoint: self.options.serverEndpoint
        });

        var logon = function() {
            return chatServer.logon(params.chatUser, params.chatPassword);
        };

        var getPrivateRoomMessages = function(token) {
            return chatServer.getPrivateRoom(token, params.room_name)
                .then((room) => {
                    return chatServer.getPrivateRoomMessages(token, params.room_name, room._id)
                        .then((data) => {
                            chatServer.logout(token);
                            return data;
                        })
                });
        };

        return logon()
            .then(getPrivateRoomMessages);
    }

    function create(data, params) {
        var chatServer = new rocketchat({
            serverEndpoint: self.options.serverEndpoint
        });

        var logon = function() {
            return chatServer.logon(params.chatUser, params.chatPassword);
        };

        var sendPrivateRoomMessage = function(token) {
            return chatServer.getPrivateRoom(token, params.room_name)
                .then((room) => {
                    return chatServer.sendPrivateRoomMessage(token, room._id, data.message)
                        .then((d) => {
                            chatServer.logout(token);

                            return {
                                room: room.name,
                                user: params.user.username,
                                message: data.message,
                                timestamp: new Date()
                            };
                        });
                });
        };
        
        return logon()
            .then(sendPrivateRoomMessage);
    }
};
