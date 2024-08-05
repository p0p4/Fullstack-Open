const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const Blog = require('../models/blog')

const api = supertest(app)

describe('verifying integrity of get requests', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('unique identifiers are properly named', async () => {
    const response = await api.get('/api/blogs')

    for (let blog of response.body) {
      // ".prototype" can be used to ignore the properties of the object itself
      assert.strictEqual(Object.prototype.hasOwnProperty.call(blog, 'id'), true)
    }
  })
})

after(async () => {
  await mongoose.connection.close()
})
