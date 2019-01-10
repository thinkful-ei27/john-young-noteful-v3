'use strict';

const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Note = require('../models/note');
const Folder = require('../models/folder');

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const {searchTerm} = req.query;
  let filter = {};

  if (searchTerm) {
    filter = {
      $or: [
        {title: { $regex: searchTerm, $options: 'i'}},
        {content: { $regex: searchTerm, $options: 'i'}}
      ]
    };
  }
  Folder
    .find(filter)
    .sort({name: 'desc'})
    .then(folders => {
      res.json(folders);
    })
    .catch(err => {
      return next(err);
    })
  ;

});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  let {id} = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not a valid ObjectId');
    err.status = 400;
    return next(err);
  }

  Folder
    .find({_id: id})
    .sort({name: 'asc'})
    .then(folders => {
      console.log(folders);
      res.json(folders[0]);
    })
    .catch(err => {
      return next(err);
    });
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const newFolder = req.body;

  if (!newFolder.name) {
    const err = new Error('A `name` property must be supplied...why did not not do that??');
    err.status = 400;
    return next(err);
  }

  Folder
    .create(newFolder)
    .then(folders => {
      res.location('path/to/new/document').status(201).json(folders);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('We already have that folder in our database you dum dum!');
        err.status = 400;
      }
      return next(err);
    });

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const folderToUpdate = req.params.id;
  const updateFolder = req.body;

  if (!updateFolder.name) {
    const err = new Error('You have to supply a name to update!');
    err.status = 400;
    return next(err);
  } else if (!mongoose.Types.ObjectId.isValid(folderToUpdate)) {
    const err = new Error('The folderId you are looking for was not found');
    err.status = 400;
    return next(err);
  }

  Folder
    .findByIdAndUpdate(folderToUpdate, updateFolder)
    .then(folders => {
      res.json(folders);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('Found a duplicate, no bueno!');
        err.status = 400;
      }
      return next(err);
    });

});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const folderToDel = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(folderToDel)) {
    const err = new Error('The `id` is not a valid folder');
    err.status = 400;
    return next(err);
  }

  return Promise.all([
    Note.deleteMany({folderId: folderToDel}),
    Folder.findByIdAndRemove(folderToDel)
  ])
    .then(([notesDeleted, foldersDelete]) => {
      console.log(`The following notes were deleted: ${notesDeleted}`);
      res.sendStatus(204);
    })
    .catch(err => {
      return next(err);
    });
});

module.exports = router;
