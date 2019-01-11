'use strict';

const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');
const Note = require('../models/note');
const Folder = require('../models/folder');
const Tag = require('../models/tag');

const { folders, notes, tags } = require('../db/seed/data');

mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
      Note.insertMany(notes),
      Folder.insertMany(folders),
      Tag.insertMany(tags),
      Folder.createIndexes(),
      Tag.createIndexes()
    ]);
  })
  .then(([notes, folderInsert, tagInsert]) => {
    console.info(`Inserted ${notes.length} Notes`);
    console.info(`Inserted ${folderInsert.length} Folders`);
    console.info(`Inserted ${tagInsert.length} Tags`);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(err);
  });