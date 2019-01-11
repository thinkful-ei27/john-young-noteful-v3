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

describe.skip('Noteful API - Tags', function () {
  before(function () {
    return mongoose.connect(TEST_MONGODB_URI, { useNewUrlParser: true })
      .then(() => mongoose.connection.db.dropDatabase());
  });
    
  beforeEach(function () {
    return Tag.insertMany(tags);
  });
    
  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });
    
  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /api/tags', function () {

    it('should return the correct number of Tags', function () {
      return Promise.all([
        Tag.find(),
        chai.request(app).get('/api/tags')
      ])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res.body.length).to.equal(data.length);
          expect(res.body).to.be.a('array');

        });
    });

    it('should return a list with the correct fields', function () {
      return Promise.all([
        Tag.find().sort({ name: 'desc'}),
        chai.request(app).get('/api/tags')
      ])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          res.body.forEach(function (item, i) {
            expect(item).to.be.a('object');
            expect(item).to.include.all.keys('id', 'name');
            expect(item.name).to.equal(data[i].name);
          });
        });
    });

    it('should return correct search results for a searchTerm query', function () {
      const searchTerm = 'feral';
      const dbPromise = Tag.find({
        name: { $regex: searchTerm, $options: 'i'}
      });
      const apiPromise = chai.request(app)
        .get(`/api/tags?searchTerm=${searchTerm}`);
    
      return Promise.all([
        dbPromise,
        apiPromise
      ])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          res.body.forEach(function (item, i) {
            expect(item.id).to.equal(data[i].id);
            expect(item.name).to.equal(data[i].name);
          });
        });
    });
  });

  describe('GET /api/tags/:id', function () {

    it('should return correct tags', function () {
      let data;
      return Tag.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).get(`/api/tags/${data.id}`);
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.all.keys('id', 'name', 'createdAt', 'updatedAt');
          expect(res.body.name).to.equal(data.name);
        });
    });

    it('should respond with status 400 and an error message when `id` is not valid', function () {
      return chai.request(app)
        .get('/api/notes/not-valid')
        .then(res => {
          expect(res).to.have.status(400);
        });
    });

    it('should respond with a 404 for an id that does not exist', function () {
      return chai.request(app)
        .get('/api/notes/DOESNOTEXIST')
        .then(res => {
          expect(res).to.have.status(404);
        });
    });

  });

  describe('POST /api/tags', function () {

    it('should create and return a new item when provided valid data', function () {
      const newTag = {
        'name': 'NewTag'
      };
      let res;
      return chai.request(app)
        .post('/api/tags')
        .send(newTag)
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          return Tag.findById(res.body.id);
        })
        .then(data => {
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(data.name);
        });
    });

    it('should return an error when missing "name" field', function () {
      const newTag = {

      };
      return chai.request(app)
        .post('/api/tags')
        .send(newTag)
        .then(res => {
          expect(res).to.have.status(400);
        });
    });

  });

  describe('PUT /api/tags/:id', function () {

    it('should update the tag when provided valid data', function () {
      const updateItem = {
        'name': 'New Tag'
      };
      let res, orig;
      return Tag.findOne()
        .then(_orig => {
          orig = _orig;
          return chai.request(app)
            .put(`/api/tags/${orig.id}`)
            .send(updateItem);
        })
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.all.keys('id', 'name', 'createdAt', 'updatedAt');
          return Tag.findById(res.body.id);
        })
        .then(data => {
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(data.name);
        });

    });

    it('should respond with status 400 and an error message when `id` is not valid', function () {
      const updateItem = {
        'name': 'A very new tag'
      };
      chai.request(app)
        .put('/api/notes/not-valid')
        .send(updateItem)
        .then(res => {
          expect(res).to.have.status(400);
        });
    });

    it('should respond with a 404 for an id that does not exist', function () {
      const updateItem = {
        'name': 'A very new tag'
      };
      chai.request(app)
        .put('/api/notes/DOESNOTEXIST')
        .send(updateItem)
        .then(res => {
          expect(res).to.have.status(404);
        });
    });

  });

  describe('DELETE /api/tags/:id', function () {

    it('should delete an existing document and respond with 204', function () {
      let data;
      return Tag.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).delete(`/api/tags/${data.id}`);
        })
        .then(function (res) {
          expect(res).to.have.status(204);
          return Tag.countDocuments({_id: data.id});
        })
        .then(count => {
          expect(count).to.equal(0);
        });
    });
  });

});