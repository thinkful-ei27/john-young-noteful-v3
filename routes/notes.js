'use strict';

const express = require('express');

const router = express.Router();
const Note = require('../models/note');

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
  Note
    .find(filter)
    .sort({updatedAt: 'desc'})
    .then(notes => {
      res.json(notes);
    })
    .catch(err => {
      return next(err);
    })
  ;

});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  let {id} = req.params;
  Note
    .find({_id: id})
    .sort({updatedAt: 'desc'})
    .then(notes => {
      console.log(notes);
      res.json(notes[0]);
    })
    .catch(err => {
      return next(err);
    });
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const newNote = req.body;

  Note
    .create(newNote)
    .then(notes => {
      res.location('path/to/new/document').status(201).json(notes);
    })
    .catch(err => {
      return next(err);
    });

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const noteToUpdate = req.params.id;
  const updateNote = req.body;

  Note
    .findByIdAndUpdate(noteToUpdate, updateNote)
    .then(notes => {
      res.json(notes);
    })
    .catch(err => {
      return next(err);
    });

});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const noteToDel = req.params.id;

  Note
    .findByIdAndRemove(noteToDel)
    .then(notes => {
      res.sendStatus(204);
    })
    .catch(err => {
      return next(err);
    });
});

module.exports = router;
