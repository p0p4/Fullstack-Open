const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const Blog = require('../models/blog')

const api = supertest(app)

describe('blog api tests', () => {
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
        assert(Object.prototype.hasOwnProperty.call(blog, 'id'))
      }
    })
  })
  describe('verifying integrity of post requests', () => {
    test('a valid blog can be added', async () => {
      const testBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://testurl.com',
        likes: 0,
      }

      await api
        .post('/api/blogs')
        .send(testBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const addedBlog = blogsAtEnd.find(
        (blog) =>
          blog.title === testBlog.title &&
          blog.author === testBlog.author &&
          blog.url === testBlog.url &&
          blog.likes === testBlog.likes
      )

      assert(addedBlog)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
