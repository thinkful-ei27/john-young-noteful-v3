'use strict';

const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true},
});

// Add 'createdAt' and 'updatedAt' fields, and remove _id and __v
tagSchema.set('timestamps', true);
tagSchema.set('toJSON', {
  virtuals: true, // include built-in virtual 'id'
  transform: (doc, ret) => {
    delete ret._id; // delete '_id'
    delete ret.__v;
  }
});

module.exports = mongoose.model('Tag', tagSchema);