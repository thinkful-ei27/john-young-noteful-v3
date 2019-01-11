'use strict';

const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

// mongoose.connect(MONGODB_URI, {useNewUrlParser:true})
//   .then(() => {
//     const searchTerm = 'Posuere';
//     let filter = {};

//     if (searchTerm) {
//       filter = {
//         $or: [
//           {title: { $regex: searchTerm, $options: 'i'}},
//           {content: { $regex: searchTerm, $options: 'i'}}
//         ]
//       };
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

mongoose.connect(MONGODB_URI, {useNewUrlParser:true})
  .then(() => {
    // template goes here
    const newNote = {
      'title': 'HUBBA DUBBA DOOP!',
      'content': 'Lorem ipsum dolorums...',
      'tags': [
        '222222222222222222222200',
        '222222222222222222222201',
        '222222222222222222222202'
      ]
    };

    return Note.create(newNote, {new: true});
  })
  .then((result) => {
    return console.log(result);
  })
  .then(() => {
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
    return mongoose.disconnect();
  });

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

// mongoose.connect(MONGODB_URI, {useNewUrlParser:true})
//   .then(() => {
//     // template goes here
//     const noteToDel = {_id: '5c34ff8523a64e572c3bec86'};

//     return Note.deleteOne(noteToDel);
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