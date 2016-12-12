'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.property = property;
exports.definition = definition;
exports.tag = tag;
exports.operation = operation;
exports.getType = getType;
exports.getFormat = getFormat;
function property(type, items) {
  var result = {
    type: getType(type),
    format: getFormat(type)
  };

  if (type === 'ARRAY') {
    var isUndefined = typeof items === 'undefined';
    var isString = typeof items === 'string';

    if (isUndefined) {
      result.items = { type: getType('INTEGER') };
    } else if (isString) {
      result.items = { '$ref': '#/definitions/' + items };
    } else {
      result.items = { type: getType(items.key) };
    }
  }

  return result;
}

function definition(model) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { type: 'object' };

  var result = {
    type: options.type,
    properties: {}
  };
  var keys = typeof model.attributes !== 'undefined' ? Object.keys(model.attributes) : [];

  keys.forEach(function (attrName) {
    var attrType = model.attributes[attrName].key;
    var prop = property(attrType, model.attributes[attrName].type);

    result.properties[attrName] = prop;
  });

  var allOf = (options.extends || []).map(function (item) {
    return {
      '$ref': '#definitions/' + item
    };
  });

  allOf.push(result);

  return {
    description: options.description,
    allOf: allOf
  };
}

function tag(name) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return {
    name: name,
    description: options.description || 'A ' + name + ' service',
    externalDocs: options.externalDocs || {}
  };
}

function operation(method, service) {
  var defaults = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var operation = service.docs[method] || {};

  operation.parameters = operation.parameters || defaults.parameters || [];
  operation.responses = operation.responses || defaults.responses || [];
  operation.description = operation.description || defaults.description || '';
  operation.summary = operation.summary || defaults.summary || '';
  operation.tags = operation.tags || defaults.tags || [];
  operation.consumes = operation.consumes || defaults.consumes || [];
  operation.produces = operation.produces || defaults.produces || [];
  operation.security = operation.security || defaults.security || [];
  operation.securityDefinitions = operation.securityDefinitions || defaults.securityDefinitions || [];
  // Clean up
  delete service.docs[method]; // Remove `find` from `docs`

  return operation;
}

function getType(type) {
  switch (type) {
    case 'STRING':
    case 'CHAR':
    case 'TEXT':
    case 'BLOB':
    case 'DATE':
    case 'DATEONLY':
    case 'TIME':
    case 'NOW':
      return 'string';
    case 'INTEGER':
    case 'BIGINT':
      return 'integer';
    case 'FLOAT':
    case 'DOUBLE':
    case 'DECIMAL':
      return 'number';
    case 'BOOLEAN':
      return 'boolean';
    case 'ARRAY':
      return 'array';
    default:
      return '';
  }
}

function getFormat(type) {
  switch (type) {
    case 'INTEGER':
    case 'DECIMAL':
      return 'int32';
    case 'BIGINT':
      return 'int64';
    case 'FLOAT':
      return 'float';
    case 'DOUBLE':
      return 'double';
    case 'DATE':
    case 'DATEONLY':
      return 'date';
    case 'TIME':
    case 'NOW':
      return 'date-time';
    default:
      return '';
  }
}