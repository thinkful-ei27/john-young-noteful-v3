'use strict';

const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const User = require('../models/user');


/* ========== POST USERS ========== */
router.post('/', (req, res, next) => {
  const {fullname, username, password} = req.body;
  const newUser = req.body;

  if (!username) {
    const err = new Error('You must supply a username');
    err.status = 400;
    return next(err);
  }

  User
    .create(newUser)
    .then(users => {
      res.location(`${req.originalUrl}/${users.id}`)
        .status(201)
        .json(users);
    })
    .catch(err => {
      return next(err);
    });
});

module.exports = router;