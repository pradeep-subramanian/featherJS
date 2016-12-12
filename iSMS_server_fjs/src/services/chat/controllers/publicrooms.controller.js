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
            return chatServer.logon(self.options.chatAdminUser, self.options.chatAdminPassword);
        };

        var getPublicRooms = function(token) {
            return chatServer.getPublicRooms(token)
                .then((data) => {
                    chatServer.logout(token);

                    var results = _.map(data, function (row) {
                        return _.omit(row, ['_id']);
                    });
                    return results;
                });
        };

        return logon()
            .then(getPublicRooms);
    }

    function get(id, params){
        var chatServer = new rocketchat({
            serverEndpoint: self.options.serverEndpoint
        });
        
        var logon = function() {
            return chatServer.logon(self.options.chatAdminUser, self.options.chatAdminPassword);
        };
        
        var getPublicRoom = function(token) {
            
            return chatServer.getPublicRoom(token, id)
                .then(r => {
                    chatServer.logout(token);
                    if (!r) {
                        return r;
                    }
                    
                    return {
                        name: r.name,
                        default: r.default === true
                    };
                });
        };

        return logon()
            .then(getPublicRoom);
    }

    function create(data, params) {
        var chatServer = new rocketchat({
            serverEndpoint: self.options.serverEndpoint
        });

        var logon = function() {
            return chatServer.logon(params.chatUser, params.chatPassword);
        };

        var createPublicRoom = function(token) {
            return chatServer.createPublicRoom(token, data.name)
                .then((d) => {                    
                    return chatServer.getPublicRoom(token, data.name)
                        .then(r => {
                            chatServer.logout(token);
                            return {
                                name: r.name,
                                default: r.default === true
                            };
                        });
                });
        };

        return logon()
            .then(createPublicRoom);
    }

    function remove(id, params) {
        var chatServer = new rocketchat({
            serverEndpoint: self.options.serverEndpoint
        });

        var logon = function() {
            return chatServer.logon(params.chatUser, params.chatPassword);
        };

        var deleteRoom = function(token) {
            return chatServer.getPublicRoom(token, id)
                .then((room) => {
                    return chatServer.deletePublicRoom(token, room._id)
                        .then((data) => {
                            chatServer.logout(token);
                    
                            return {
                                name: room.name,
                                default: room.default === true
                            };
                        });
                });
        };

        return logon()
            .then(deleteRoom);
    }
};
