'use strict';

const path = require('path');
const serveStatic = require('feathers').static;
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const bodyParser = require('body-parser');
const socketio = require('feathers-socketio');
const middleware = require('./middleware');
const services = require('./services');
const swagger = require('./swagger');

const app = feathers();

app.configure(configuration(path.join(__dirname, '..')));

app.use(compress())
  .options('*', cors())
  .use(cors())
  .use(favicon( path.join(app.get('public'), 'favicon.ico') ))
  .use('/', serveStatic( app.get('public') ))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(hooks())
  .configure(rest())
  .configure(socketio())
  .configure(swagger({
    docsPath: '/docs',
    version: '1.0',
    uiIndex: path.join(__dirname, './docs.html'),
    info: {
      title: 'iSMS Server APIs',
      description: 'Documentation of iSMS server web APIs'
    },
    security: {
      'type': 'apiKey',
      'name': 'authorization',
      'in': 'header'
    },
    securityDefinitions: {
      'authorization': {
        'type': 'apiKey',
        'name': 'authorization',
        'in': 'header'
      }
    },
    definitions: {
      'local': {
        type: 'object',
        properties: {
          username: {
            type: 'string',
          },
          password: {
            type: 'string',
          }
        }
      },
      'token': {
        type: 'object',
        properties: {
          token: {
            type: 'string',
          }
        }
      }
    }
  }))
  .configure(services)
  .configure(middleware);

module.exports = app;
