'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _serveStatic = require('serve-static');

var _serveStatic2 = _interopRequireDefault(_serveStatic);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init(config) {
  return function () {
    var app = this;

    // Apply configuration
    var rootDoc = Object.assign({
      paths: {},
      definitions: {},
      swagger: '2.0',
      schemes: ['http'],
      tags: [],
      basePath: '',
      docsPath: '/docs',
      consumes: ['application/json'],
      produces: ['application/json'],
      info: {},
      ignore: {
        tags: []
      }
    }, config || {});

    var docsPath = rootDoc.docsPath;

    // Create API for Documentation
    app.get(docsPath, function (req, res) {
      res.format({
        'application/json': function applicationJson() {
          res.json(rootDoc);
        },

        'text/html': function textHtml() {
          var parsed = _url2.default.parse(req.url);
          var pathname = parsed.pathname;

          if (pathname[pathname.length - 1] !== '/') {
            parsed.pathname = pathname + '/';
            return res.redirect(301, _url2.default.format(parsed));
          }

          if (typeof config.uiIndex === 'function') {
            config.uiIndex(req, res);
          } else if (typeof config.uiIndex === 'string') {
            res.sendFile(config.uiIndex);
          } else {
            res.json(rootDoc);
          }
        }
      });
    });

    if (typeof config.uiIndex !== 'undefined') {
      var uiPath = _path2.default.dirname(require.resolve('swagger-ui'));
      app.use(docsPath, (0, _serveStatic2.default)(uiPath));
    }

    app.docs = rootDoc;

    // Optional: Register this plugin as a Feathers provider
    app.providers.push(function (path, service) {
      service.docs = service.docs || {};

      // Load documentation from service, if available.
      var doc = service.docs;
      var group = path.split('/');
      var tag = path;

      if (path.indexOf(':') > -1) {
        path = group[0];

        for (var i = 1; i < group.length; i++) {
          if (group[i].startsWith(':')) {
            path = path + '/' + group[i].replace(':', '{') + '}';
          } else {
            path = path + '/' + group[i];
          }
        }

        tag = path;
      }

      var model = path.indexOf('/') > -1 ? group[group.length - 1] : path;
      var security = {};

      if (rootDoc.security) {
        security[rootDoc.security.name] = [];
      }

      if (rootDoc.ignore.tags.indexOf(tag) > -1) {
        return;
      }

      var pathObj = rootDoc.paths;
      var withIdKey = '/' + path + '/{' + (service.id || 'id') + '}';
      var withoutIdKey = '/' + path;
      var securities = doc.securities || [];

      if (typeof pathObj[withoutIdKey] === 'undefined') {
        pathObj[withoutIdKey] = {};
      }

      if (typeof pathObj[withIdKey] === 'undefined') {
        pathObj[withIdKey] = {};
      }

      if (typeof doc.definition !== 'undefined') {
        rootDoc.definitions[tag] = doc.definition;
      }

      if (typeof doc.definitions !== 'undefined') {
        rootDoc.definitions = Object.assign(rootDoc.definitions, doc.definitions);
      }

      // FIND
      if (typeof service.find === 'function') {
        pathObj[withoutIdKey].get = utils.operation('find', service, {
          tags: [tag],
          description: 'Retrieves a list of all resources from the service.',
          produces: rootDoc.produces,
          consumes: rootDoc.consumes,
          security: securities.indexOf('find') > -1 ? security : {}
        });
      }

      // GET
      if (typeof service.get === 'function') {
        pathObj[withIdKey].get = utils.operation('get', service, {
          tags: [tag],
          description: 'Retrieves a single resource with the given id from the service.',
          parameters: [{
            description: 'ID of ' + model + ' to return',
            in: 'path',
            required: true,
            name: 'resourceId',
            type: 'integer'
          }],
          responses: {
            '200': {
              description: 'success'
            }
          },
          produces: rootDoc.produces,
          consumes: rootDoc.consumes,
          security: securities.indexOf('get') > -1 ? security : {}
        });
      }

      // CREATE
      if (typeof service.create === 'function') {
        pathObj[withoutIdKey].post = utils.operation('create', service, {
          tags: [tag],
          description: 'Creates a new resource with data.',
          parameters: [{
            in: 'body',
            name: 'body',
            required: true,
            schema: { '$ref': '#/definitions/' + model }
          }],
          produces: rootDoc.produces,
          consumes: rootDoc.consumes,
          security: securities.indexOf('create') > -1 ? security : {}
        });
      }

      // UPDATE
      if (typeof service.update === 'function') {
        pathObj[withIdKey].put = utils.operation('update', service, {
          tags: [tag],
          description: 'Updates the resource identified by id using data.',
          parameters: [{
            description: 'ID of ' + model + ' to return',
            in: 'path',
            required: true,
            name: 'resourceId',
            type: 'integer'
          }, {
            in: 'body',
            name: 'body',
            required: true,
            schema: { '$ref': '#/definitions/' + model }
          }],
          produces: rootDoc.produces,
          consumes: rootDoc.consumes,
          security: securities.indexOf('update') > -1 ? security : {}
        });
      }

      // PATCH
      if (typeof service.patch === 'function') {
        pathObj[withIdKey].patch = utils.operation('patch', service, {
          tags: [tag],
          description: 'Updates the resource identified by id using data.',
          parameters: [{
            description: 'ID of ' + model + ' to return',
            in: 'path',
            required: true,
            name: 'resourceId',
            type: 'integer'
          }, {
            in: 'body',
            name: 'body',
            required: true,
            schema: { '$ref': '#/definitions/' + model }
          }],
          produces: rootDoc.produces,
          consumes: rootDoc.consumes,
          security: securities.indexOf('patch') > -1 ? security : {}
        });
      }

      // REMOVE
      if (typeof service.remove === 'function') {
        pathObj[withIdKey].delete = utils.operation('remove', service, {
          tags: [tag],
          description: 'Removes the resource with id.',
          parameters: [{
            description: 'ID of ' + model + ' to return',
            in: 'path',
            required: true,
            name: 'resourceId',
            type: 'integer'
          }],
          produces: rootDoc.produces,
          consumes: rootDoc.consumes,
          security: securities.indexOf('remove') > -1 ? security : {}
        });
      }

      rootDoc.paths = pathObj;
      if (!rootDoc.tags.find(function (item) {
        return item.name === tag;
      })) {
        rootDoc.tags.push(utils.tag(tag, doc));
      }
    });
  };
}

Object.assign(init, utils);
module.exports = exports['default'];