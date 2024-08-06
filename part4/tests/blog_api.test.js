const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const Blog = require('../models/blog')
const { title } = require('node:process')

const api = supertest(app)

describe('blog api tests', () => {
  describe('verifying integrity of get requests', () => {
    beforeEach(async () => {
      await Blog.deleteMany({})
      await Blog.insertMany(helper.initialBlogs)
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
        // ".prototype" can be used to ignore the methods of the object
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
    test('handling of undefined likes property', async () => {
      const testBlog = {
        title: 'Test Blog2',
        author: 'Test Author2',
        url: 'http://testurl2.com',
      }

      await api
        .post('/api/blogs')
        .send(testBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      const addedBlog = blogsAtEnd.find(
        (blog) => blog.title === testBlog.title && blog.author === testBlog.author && blog.url === testBlog.url
      )

      assert.strictEqual(addedBlog.likes, 0)
    })
    test('fails with statuscode 400 if title or url are missing', async () => {
      const testBlog = {
        author: 'Test Author3',
        likes: 3,
      }

      await api.post('/api/blogs').send(testBlog).expect(400)
    })
  })
  describe('verifying integrity of delete requests', () => {
    test('deletion succeeds with statuscode 204', async () => {
      await api.delete(`/api/blogs/${helper.initialBlogs[0]._id}`).expect(204)
    })
  })
  describe('verifying integrity of put requests', () => {
    test('updating properties of a blog', async () => {
      const initialBlog = helper.initialBlogs[1]

      const updateBlog = {
        likes: 100,
      }

      await api
        .put(`/api/blogs/${initialBlog._id}`)
        .send(updateBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlogInDb = blogsAtEnd.find((blog) => blog.id === initialBlog._id)

      assert.strictEqual(updatedBlogInDb.likes, updateBlog.likes)
      assert.strictEqual(updatedBlogInDb.title, initialBlog.title)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
