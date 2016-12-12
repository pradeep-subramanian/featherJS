'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Keyword Schema
 */
var KeywordSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Keyword name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Keyword', KeywordSchema);
