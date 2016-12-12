'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Ad Schema
 */
var AdSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Ad name',
    trim: true
  },
  description: {
	type: String,
	default: '',
	required: 'Please fill in a description string!',
	trim: true
  },
  url: {
	type: String,
	default: '',
	required: 'Please fill in a URL!',
	trim: true
  },
  numViews: {
	type: Number,
	default: '',
	required: 'Please fill in the total number of views!!',
	trim: true
  },
  numClicks: {
	type: Number,
	default: '',
	required: 'Please fill in the total number of clicks!',
	trim: true
  },
  clickThroughRate: {
	type: Number,
	default: '',
	required: 'Please fill in the click through rate!',
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

mongoose.model('Ad', AdSchema);
