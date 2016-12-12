'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Campaign Schema
 */
var CampaignSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Campaign name',
    trim: true
  },
  keywords: {
    //type: String,
	type: [{ type: Schema.Types.ObjectId, ref: 'Keyword' }],
	//type: Array,
    default: '',
    required: 'Please fill in the keywords',
    trim: true
  },
  costPerClick: {
    type: Number,
    default: '',
    required: 'Please fill in the cost per click',
    trim: true
  },
  totalBudget: {
    type: Number,
    default: '',
    required: 'Please fill in the total budget',
    trim: true
  },
  remainingBudget: {
    type: Number,
    default: '',
    required: 'Please fill in how much budget is left',
    trim: true
  },
  advertisement: {
    //type: String,
	type: [{ type: Schema.Types.ObjectId, ref: 'Ad' }],
    //default: '',
    required: 'Please fill in the advertisements',
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

mongoose.model('Campaign', CampaignSchema);
