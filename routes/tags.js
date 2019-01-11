'use strict';

const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Note = require('../models/note');
const Folder = require('../models/folder');
const Tag = require('../models/tag');

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const {searchTerm} = req.query;
  let filter = {};

  if (searchTerm) {
    filter = {
      $or: [
        {name: { $regex: searchTerm, $options: 'i'}}
      ]
    };
  }
  Tag
    .find(filter)
    .sort({name: 'desc'})
    .then(tags => {
      res.json(tags);
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

  Tag
    .find({_id: id})
    .sort({name: 'asc'})
    .then(tags => {
      console.log(tags);
      res.json(tags[0]);
    })
    .catch(err => {
      return next(err);
    });
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const newTag = req.body;

  if (!newTag.name) {
    const err = new Error('A `name` property must be supplied...why did not not do that??');
    err.status = 400;
    return next(err);
  }

  Tag
    .create(newTag)
    .then(tags => {
      res.location('path/to/new/document').status(201).json(tags);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('We already have that tag in our database you dum dum!');
        err.status = 400;
      }
      return next(err);
    });

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const tagToUpdate = req.params.id;
  const updateTag = req.body;

  if (!updateTag.name) {
    const err = new Error('You have to supply a name to update!');
    err.status = 400;
    return next(err);
  } else if (!mongoose.Types.ObjectId.isValid(tagToUpdate)) {
    const err = new Error('The tagId you are looking for is invalid');
    err.status = 400;
    return next(err);
  }

  Tag
    .findByIdAndUpdate(tagToUpdate, updateTag, { new: true })
    .then(tags => {
      res.json(tags);
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
  const tagToDel = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(tagToDel)) {
    const err = new Error('The `id` is not a valid tag');
    err.status = 400;
    return next(err);
  }

  return Promise.all([
    Tag.findByIdAndRemove(tagToDel),
    Note.updateMany(
      {},
      {$pull: {tags: tagToDel}}
    )
  ])
    .then(([notesDeleted, tagsDelete]) => {
      console.log(`The following notes were deleted: ${notesDeleted}`);
      res.sendStatus(204);
    })
    .catch(err => { 
      return next(err);
    });
});

module.exports = router;
