'use strict';

const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');
const Note = require('../models/note');
const Folder = require('../models/folder');

const { folders, notes } = require('../db/seed/data');

mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
      Note.insertMany(notes),
      Folder.insertMany(folders),
      Folder.createIndexes(),
    ]);
  })
  .then(([notes, folderInsert, folderIndex]) => {
    console.info(`Inserted ${notes.length} Notes`);
    console.info(`Inserted ${folderInsert.length} Folders`);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(err);
  });