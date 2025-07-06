const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')

const User = require('../models/user')

const api = supertest(app)

describe('user api tests', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'tokenUser', passwordHash })

    await user.save()
  })

  describe('verifying integrity of post requests', () => {
    test('a valid user can be added', async () => {
      const usersAtStart = await helper.usersInDb()

      const testUser = {
        username: 'use',
        name: 'name',
        password: 'pas',
      }

      await api
        .post('/api/users')
        .send(testUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map((user) => user.username)
      assert(usernames.includes(testUser.username))
    })

    test('username is required', async () => {
      const usersAtStart = await helper.usersInDb()

      const testUser = {
        name: 'name',
        password: 'password',
      }

      const missingUsernameErrorMessage = { error: 'User validation failed: username: is required' }

      const errorMessage = await api
        .post('/api/users')
        .send(testUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(errorMessage.body, missingUsernameErrorMessage)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('password is required', async () => {
      const usersAtStart = await helper.usersInDb()

      const testUser = {
        username: 'username',
        name: 'name',
      }

      const missingPasswordErrorMessage = { error: 'password is required' }

      const errorMessage = await api
        .post('/api/users')
        .send(testUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(errorMessage.body, missingPasswordErrorMessage)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)

      const usernames = usersAtEnd.map((user) => user.username)
      assert(!usernames.includes(testUser.username))
    })

    test('username length is validated', async () => {
      const usersAtStart = await helper.usersInDb()

      const testUser = {
        username: 'us',
        name: 'name',
        password: 'password',
      }

      const shortUsernameErrorMessage = {
        error: 'User validation failed: username: must be at least 3 characters long',
      }

      const errorMessage = await api
        .post('/api/users')
        .send(testUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(errorMessage.body, shortUsernameErrorMessage)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)

      const usernames = usersAtEnd.map((user) => user.username)
      assert(!usernames.includes(testUser.username))
    })

    test('password length is validated', async () => {
      const usersAtStart = await helper.usersInDb()

      const testUser = {
        username: 'username',
        name: 'name',
        password: 'pw',
      }

      const shortPasswordErrorMessage = { error: 'password must be at least 3 characters long' }

      const errorMessage = await api
        .post('/api/users')
        .send(testUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(errorMessage.body, shortPasswordErrorMessage)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)

      const usernames = usersAtEnd.map((user) => user.username)
      assert(!usernames.includes(testUser.username))
    })

    test('username must be unique', async () => {
      const testUser = {
        username: 'username',
        name: 'name',
        password: 'password',
      }

      await api.post('/api/users').send(testUser)

      const usersAtStart = await helper.usersInDb()

      const duplicateUsernameErrorMessage = {
        error: 'expected `username` to be unique',
      }

      const errorMessage = await api
        .post('/api/users')
        .send(testUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(errorMessage.body, duplicateUsernameErrorMessage)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)

      const usernames = usersAtEnd.map((user) => user.username)
      assert.strictEqual(usernames.filter((username) => username === testUser.username).length, 1)
    })
  })
})

after(async () => {
  User.deleteMany({})
  await mongoose.connection.close()
})
