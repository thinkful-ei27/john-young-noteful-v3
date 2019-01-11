'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');

const Note = require('../models/note');
const Folder = require('../models/folder');
const Tag = require('../models/tag');

const { tags } = require('../db/seed/data');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Noteful API - Tags', function () {
  before(function () {
    return mongoose.connect(TEST_MONGODB_URI, { useNewUrlParser: true })
      .then(() => mongoose.connection.db.dropDatabase());
  });
    
  beforeEach(function () {
    return Note.insertMany(tags);
  });
    
  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });
    
  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /api/notes', function () {

    it('should return the correct number of Tags', function () {
    });

    it('should return a list with the correct fields', function () {
    });

    it('should return correct search results for a searchTerm query', function () {
    });

    it('should return an empty array for an incorrect query', function () {
    });
  });

  describe('GET /api/tags/:id', function () {

    it('should return correct tags', function () {
    });

    it('should respond with status 400 and an error message when `id` is not valid', function () {
    });

    it('should respond with a 404 for an id that does not exist', function () {
    });

  });

  describe('POST /api/tags', function () {

    it('should create and return a new item when provided valid data', function () {
    });

    it('should return an error when missing "name" field', function () {
    });

  });

  describe('PUT /api/tags/:id', function () {

    it('should update the tag when provided valid data', function () {
    });

    it('should respond with status 400 and an error message when `id` is not valid', function () {
    });

    it('should respond with a 404 for an id that does not exist', function () {
    });

    it('should return an error when missing "name" field', function () {
    });

  });

  describe('DELETE /api/tags/:id', function () {

    it('should delete an existing document and respond with 204', function () {
    });
  });

});