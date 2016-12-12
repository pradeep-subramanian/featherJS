'use strict';

const publicRoomHooks = require('./hooks/publicrooms');
const publicRoomsController = require('./controllers/publicrooms.controller');
const publicRoomMemberHooks = require('./hooks/publicroommembers');
const publicRoomMembersController = require('./controllers/publicroommembers.controller');
const publicRoomMessageHooks = require('./hooks/publicroommessages');
const publicRoomMessagesController = require('./controllers/publicroommessages.controller');

const privateRoomHooks = require('./hooks/privaterooms');
const privateRoomsController = require('./controllers/privaterooms.controller');
const privateRoomMemberHooks = require('./hooks/privateroommembers');
const privateRoomMembersController = require('./controllers/privateroommembers.controller');
const privateRoomMessageHooks = require('./hooks/privateroommessages');
const privateRoomMessagesController = require('./controllers/privateroommessages.controller');

module.exports = function(){
  const app = this;

  let config = app.get('rocketchat');
  let encryption = app.get('encryption');

  const options = {
    serverEndpoint: config.serverEndpoint,
    chatAdminUser: config.adminUser,
    chatAdminPassword: config.adminPassword,
    encryptionPassword: encryption.encryptionPassword
  };

  // Initialize publicrooms service
  var publicRoomCtrl = new publicRoomsController(options);
  publicRoomCtrl.docs = {
      description: 'Public chat room operations',
      definitions: {
        'publicroom': {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            default: {
              type: 'boolean'
            }
          }
        },
        'roomname': {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              required: true
            }
          }
        }
      },
      securities: ['find', 'get', 'create', 'remove'],
      find: {
        responses: {
          '200': {
            description: 'Successful operation',
            schema: {
              '$ref': '#/definitions/publicroom'
            }
          }
        }
      },
      create: {
        parameters: [{
          description: 'New public chat room name',
          in : 'body',
          required: true,
          name: 'roomname',
          type: 'object',
          schema: {
              '$ref': '#/definitions/roomname'
            }
        }],
        responses: {
          '201': {
            description: 'Successful operation',
            schema: {
              '$ref': '#/definitions/publicroom'
            }
          }
        }
      },
      remove: {
        parameters: [{
          description: 'Public chat room name to delete',
          in : 'path',
          required: true,
          name: 'id',
          type: 'string'
        }],
        responses: {
          '200': {
            description: 'Successful operation',
            schema: {
              '$ref': '#/definitions/publicroom'
            }
          }
        }
      },
      get: {
        parameters: [{
          description: 'Public chat room name to retrieve',
          in : 'path',
          required: true,
          name: 'id',
          type: 'string'
        }],
        responses: {
          '200': {
            description: 'Successful operation',
            schema: {
              '$ref': '#/definitions/publicroom'
            }
          }
        }
      }
    };
  app.use('/api/v1/publicrooms', publicRoomCtrl);
  const publicRoomsService = app.service('/api/v1/publicrooms');
  publicRoomsService.before(publicRoomHooks.before);
  publicRoomsService.after(publicRoomHooks.after);

  // Initialize publicroommembers service
  var publicRoomMemberCtrl = new publicRoomMembersController(options);
  publicRoomMemberCtrl.docs = {
      description: 'Public chat room member operations',
      securities: ['find', 'create', 'remove'],
      find: {
        parameters: [{
          description: 'Public chat room name',
          in : 'path',
          required: true,
          name: 'room_name',
          type: 'string'
        }],
        responses: {
          '200': {
            description: 'Successful operation',
            type: 'array',
            items: {
              type: 'string'
            }
          }
        }
      },
      create: {
        parameters: [{
          description: 'Public chat room name the current user will join',
          in : 'path',
          required: true,
          name: 'room_name',
          type: 'string'
        }],
        responses: {
          '201': {
            description: 'Successful operation',
            type: 'string'
          }
        }
      },
      remove: {
        parameters: [{
          description: 'Public chat room name the current user will leave',
          in : 'path',
          required: true,
          name: 'room_name',
          type: 'string'
        }],
        responses: {
          '200': {
            description: 'Successful operation',
            type: 'string'
          }
        }
      }
    };
  app.use('/api/v1/publicrooms/:room_name/members', publicRoomMemberCtrl);
  const publicRoomMembersService = app.service('/api/v1/publicrooms/:room_name/members');
  publicRoomMembersService.before(publicRoomMemberHooks.before);
  publicRoomMembersService.after(publicRoomMemberHooks.after);

  // Initialize publicroommassages service
  var publicRoomMessageCtrl = new publicRoomMessagesController(options);
  publicRoomMessageCtrl.docs = {
      description: 'Public chat room messaging operations',
      definitions: {
        'room_message': {
          type: 'object',
          properties: {
            room: {
              type: 'string'
            },
            timestamp: {
              type: 'string'
            },
            user: {
              type: 'string'
            },
            message: {
              type: 'string'
            }
          }
        },
        'message': {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            }
          }
        }
      },
      securities: ['find', 'create'],
      find: {
        parameters: [{
          description: 'Public chat room name',
          in : 'path',
          required: true,
          name: 'room_name',
          type: 'string'
        }],
        responses: {
          '200': {
            description: 'Successful operation',
            schema: {
              '$ref': '#/definitions/room_message'
            }
          }
        }
      },
      create: {
        parameters: [{
          description: 'Public chat room to send message to',
          in : 'path',
          required: true,
          name: 'room_name',
          type: 'string'
        }, {
          description: 'Message to send',
          in : 'body',
          required: true,
          name: 'message',
          type: 'object',
          schema: {
              '$ref': '#/definitions/message'
            }
        }],
        responses: {
          '201': {
            description: 'Successful operation',
            schema: {
              '$ref': '#/definitions/room_message'
            }
          }
        }
      }
    };
  app.use('/api/v1/publicrooms/:room_name/messages', publicRoomMessageCtrl);
  const publicRoomMessagesService = app.service('/api/v1/publicrooms/:room_name/messages');
  publicRoomMessagesService.before(publicRoomMessageHooks.before);
  publicRoomMessagesService.after(publicRoomMessageHooks.after);

  // Initialize privaterooms service
  var privateRoomCtrl = new privateRoomsController(options);
  privateRoomCtrl.docs = {
      description: 'Private chat room operations',
      definitions: {
        'privateroom': {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            }
          }
        }
      },
      securities: ['find', 'get', 'create', 'remove'],
      find: {
        responses: {
          '200': {
            description: 'Successful operation',
            schema: {
              '$ref': '#/definitions/privateroom'
            }
          }
        }
      },
      create: {
        parameters: [{
          description: 'New private chat room name',
          in : 'body',
          required: true,
          name: 'roomname',
          type: 'object',
          schema: {
              '$ref': '#/definitions/privateroom'
            }
        }],
        responses: {
          '201': {
            description: 'Successful operation',
            schema: {
              '$ref': '#/definitions/privateroom'
            }
          }
        }
      },
      remove: {
        parameters: [{
          description: 'Private chat room name to delete',
          in : 'path',
          required: true,
          name: 'id',
          type: 'string'
        }],
        responses: {
          '200': {
            description: 'Successful operation',
            schema: {
              '$ref': '#/definitions/privateroom'
            }
          }
        }
      },
      get: {
        parameters: [{
          description: 'Private chat room name to retrieve',
          in : 'path',
          required: true,
          name: 'id',
          type: 'string'
        }],
        responses: {
          '200': {
            description: 'Successful operation',
            schema: {
              '$ref': '#/definitions/privateroom'
            }
          }
        }
      }
    };
  app.use('/api/v1/privaterooms', privateRoomCtrl);
  const privateRoomsService = app.service('/api/v1/privaterooms');
  privateRoomsService.before(privateRoomHooks.before);
  privateRoomsService.after(privateRoomHooks.after);

  // Initialize privateroommembers service
  var privateRoomMemberCtrl = new privateRoomMembersController(options);
  privateRoomMemberCtrl.docs = {
      description: 'Private chat room member operations',
      definitions: {
        'privateroomuser': {
          type: 'object',
          properties: {
            username: {
              type: 'string'
            }
          }
        }
      },
      securities: ['find', 'create', 'remove'],
      find: {
        parameters: [{
          description: 'Private chat room name',
          in : 'path',
          required: true,
          name: 'room_name',
          type: 'string'
        }],
        responses: {
          '200': {
            description: 'Successful operation',
            type: 'strict',
            items: {
              type: 'string'
            }
          }
        }
      },
      create: {
        parameters: [{
          description: 'Private chat room name',
          in : 'path',
          required: true,
          name: 'room_name',
          type: 'string'
        }, {
          description: 'User to add to the private chat room',
          in : 'body',
          required: true,
          name: 'user',
          type: 'object',
          schema: {
              '$ref': '#/definitions/privateroomuser'
            }
        }],
        responses: {
          '201': {
            description: 'Successful operation',
            type: 'string'
          }
        }
      },
      remove: {
        parameters: [{
          description: 'Private chat room name',
          in : 'path',
          required: true,
          name: 'room_name',
          type: 'string'
        }, {
          description: 'User to remove from the private chat room',
          in : 'path',
          required: true,
          name: 'id',
          type: 'string'
        }],
        responses: {
          '200': {
            description: 'Successful operation',
            type: 'string'
          }
        }
      }
    };
  app.use('/api/v1/privaterooms/:room_name/members', privateRoomMemberCtrl);
  const privateRoomMembersService = app.service('/api/v1/privaterooms/:room_name/members');
  privateRoomMembersService.before(privateRoomMemberHooks.before);
  privateRoomMembersService.after(privateRoomMemberHooks.after);

  // Initialize privateroommassages service
  var privateRoomMessageCtrl = new privateRoomMessagesController(options);
  privateRoomMessageCtrl.docs = {
      description: 'Private chat room messaging operations',
      definitions: {
        'room_message': {
          type: 'object',
          properties: {
            room: {
              type: 'string'
            },
            timestamp: {
              type: 'string'
            },
            user: {
              type: 'string'
            },
            message: {
              type: 'string'
            }
          }
        },
        'message': {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            }
          }
        }
      },
      securities: ['find', 'create'],
      find: {
        parameters: [{
          description: 'Private chat room name',
          in : 'path',
          required: true,
          name: 'room_name',
          type: 'string'
        }],
        responses: {
          '200': {
            description: 'Successful operation',
            schema: {
              '$ref': '#/definitions/room_message'
            }
          }
        }
      },
      create: {
        parameters: [{
          description: 'Private chat room to send message to',
          in : 'path',
          required: true,
          name: 'room_name',
          type: 'string'
        }, {
          description: 'Message to send',
          in : 'body',
          required: true,
          name: 'message',
          type: 'object',
          schema: {
              '$ref': '#/definitions/message'
            }
        }],
        responses: {
          '201': {
            description: 'Successful operation',
            schema: {
              '$ref': '#/definitions/room_message'
            }
          }
        }
      }
    };
  app.use('/api/v1/privaterooms/:room_name/messages', privateRoomMessageCtrl);
  const privateRoomMessagesService = app.service('/api/v1/privaterooms/:room_name/messages');
  privateRoomMessagesService.before(privateRoomMessageHooks.before);
  privateRoomMessagesService.after(privateRoomMessageHooks.after);
};