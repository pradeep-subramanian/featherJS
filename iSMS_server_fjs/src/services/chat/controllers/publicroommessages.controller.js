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

        var getPublicRoomMessages = function(token) {
            return chatServer.getPublicRoom(token, params.room_name)
                .then((room) => {
                    return chatServer.getPublicRoomMessages(token, params.room_name, room._id)
                        .then((data) => {
                            chatServer.logout(token);
                            return data;
                        })
                });
        };

        return logon()
            .then(getPublicRoomMessages);
    }

    function create(data, params) {
        var chatServer = new rocketchat({
            serverEndpoint: self.options.serverEndpoint
        });

        var logon = function() {
            return chatServer.logon(params.chatUser, params.chatPassword);
        };

        var sendPublicRoomMessage = function(token) {
            return chatServer.getPublicRoom(token, params.room_name)
                .then((room) => {
                    return chatServer.sendPublicRoomMessage(token, room._id, data.message)
                        .then((d) => {
                            chatServer.logout(token);

                            return {
                                room: room.name,
                                user: params.user.username,
                                message: data.message,
                                timestamp: new Date()
                            };
                        })
                });
        };
        
        return logon()
            .then(sendPublicRoomMessage);
    }
};
