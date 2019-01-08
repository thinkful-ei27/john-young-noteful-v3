'use strict';

const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

// mongoose.connect(MONGODB_URI, {useNewUrlParser:true})
//   .then(() => {
//     const searchTerm = 'lady gaga';
//     let filter = {};

//     if (searchTerm) {
//       filter.title = { $regex: searchTerm, $options: 'i'};
//     }
//     return Note.find(filter).sort({updatedAt: 'desc'});
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// mongoose.connect(MONGODB_URI, {useNewUrlParser:true})
//   .then(() => {
//     // template goes here
//     let id = '111111111111111111111105';
//     return Note.find({_id: id}).sort({updatedAt: 'desc'});
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// mongoose.connect(MONGODB_URI, {useNewUrlParser:true})
//   .then(() => {
//     // template goes here
//     const newNote = {
//       title: 'A brand new title',
//       content: 'With some brand new content'
//     };

//     return Note.create(newNote);
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// mongoose.connect(MONGODB_URI, {useNewUrlParser:true})
//   .then(() => {
//     // template goes here
//     const noteToUpdate = {_id: '5c34ff8523a64e572c3bec86'};
//     const updateNote = {
//       content: 'With some brand new content'
//     };

//     return Note.update(noteToUpdate, updateNote);
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect();
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

mongoose.connect(MONGODB_URI, {useNewUrlParser:true})
  .then(() => {
    // template goes here
    const noteToDel = {_id: '5c34ff8523a64e572c3bec86'};

    return Note.deleteOne(noteToDel);
  })
  .then(results => {
    console.log(results);
  })
  .then(() => {
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });