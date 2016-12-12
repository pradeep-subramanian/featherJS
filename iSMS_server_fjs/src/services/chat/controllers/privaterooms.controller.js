'use strict';

const _ = require('underscore');
var rocketchat = require('../../rocketchat/rocketchatservice');

module.exports = function(options) {
    var self = this;

    self.options = options || {};
    self.find = find;
    self.get = get;
    self.create = create;
    self.remove = remove;

    function find(params) {
        var chatServer = new rocketchat({
            serverEndpoint: self.options.serverEndpoint
        });

        var logon = function() {
            return chatServer.logon(params.chatUser, params.chatPassword);
        };

        var getPrivateRooms = function(token) {
            return chatServer.getPrivateRooms(token)
                .then((data) => {
                    chatServer.logout(token);

                    var results = _.map(data, function (row) {
                        return _.omit(row, ['_id']);
                    });
                    return results;
                });
        };

        return logon()
            .then(getPrivateRooms);
    }

    function get(id, params){
        var chatServer = new rocketchat({
            serverEndpoint: self.options.serverEndpoint
        });
        
        var logon = function() {
            return chatServer.logon(params.chatUser, params.chatPassword);
        };
        
        var getPrivateRoom = function(token) {
            
            return chatServer.getPrivateRoom(token, id)
                .then(r => {
                    chatServer.logout(token);
                    if (!r) {
                        return r;
                    }
                    
                    return {
                        name: r.name
                    };
                });
        };

        return logon()
            .then(getPrivateRoom);
    }

    function create(data, params) {
        var chatServer = new rocketchat({
            serverEndpoint: self.options.serverEndpoint
        });

        var logon = function() {
            return chatServer.logon(params.chatUser, params.chatPassword);
        };

        var createPrivateRoom = function(token) {
            return chatServer.createPrivateRoom(token, data.name)
                .then((d) => {                    
                    chatServer.logout(token);
                        return {
                            name: data.name
                        };
                });
        };

        return logon()
            .then(createPrivateRoom);
    }

    function remove(id, params) {
        var chatServer = new rocketchat({
            serverEndpoint: self.options.serverEndpoint
        });

        var logon = function() {
            return chatServer.logon(params.chatUser, params.chatPassword);
        };

        var deleteRoom = function(token) {
            return chatServer.getPrivateRoom(token, id)
                .then((room) => {
                    return chatServer.deletePrivateRoom(token, room._id)
                        .then((data) => {
                            chatServer.logout(token);
                    
                            return {
                                name: room.name
                            };
                        });
                });
        };

        return logon()
            .then(deleteRoom);
    }
};
