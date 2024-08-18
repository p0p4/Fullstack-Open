const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')

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
    let token = null
    beforeEach(async () => {
      await Blog.deleteMany({})
      await User.deleteMany({})

      const passwordHash = await bcrypt.hash('password', 10)
      const user = new User({ username: 'tokenUser', passwordHash })

      await user.save()

      const userForToken = {
        username: user.username,
        id: user._id,
      }
      token = jwt.sign(userForToken, process.env.SECRET)

      await Blog.insertMany(helper.initialBlogs)
    })

    test('a valid blog can be added', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const testBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://testurl.com',
        likes: 0,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(testBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

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
        .set('Authorization', `Bearer ${token}`)
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

      await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(testBlog).expect(400)
    })

    test('fails with statuscode 401 if a token is missing', async () => {
      const testBlog = {
        title: 'Test Blog4',
        author: 'Test Author4',
        url: 'http://testurl4.com',
        likes: 4,
      }

      await api
        .post('/api/blogs')
        .send(testBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)
    })
  })

  describe('verifying integrity of delete requests', () => {
    let token = null
    beforeEach(async () => {
      await User.deleteMany({})
      await Blog.deleteMany({})

      const passwordHash = await bcrypt.hash('password', 10)
      const user = new User({ username: 'tokenUser', passwordHash })

      await user.save()

      token = jwt.sign({ username: user.username, id: user.id }, process.env.SECRET)

      for (let blog of helper.initialBlogs) blog.user = user.id

      await Blog.insertMany(helper.initialBlogs)
    })

    test('deletion succeeds with statuscode 204', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const blog = await Blog.findOne()
      await api.delete(`/api/blogs/${blog.id}`).set('Authorization', `Bearer ${token}`).expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

      assert(!blogsAtEnd.map((b) => b.id).includes(blog.id))
    })
  })

  describe('verifying integrity of put requests', () => {
    test('updating properties of a blog', async () => {
      const blog = await Blog.findOne()

      const updateBlog = {
        likes: 100,
      }

      await api
        .put(`/api/blogs/${blog.id}`)
        .send(updateBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlogInDb = blogsAtEnd.find((b) => b.id === blog.id)

      assert.strictEqual(updatedBlogInDb.likes, updateBlog.likes)
      assert.strictEqual(updatedBlogInDb.title, blog.title)
    })
  })
})

after(async () => {
  Blog.deleteMany({})
  User.deleteMany({})
  await mongoose.connection.close()
})
