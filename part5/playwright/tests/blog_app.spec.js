const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')

describe('Blog app', () => {
  const user = {
    username: 'usernameTest',
    password: 'password',
    name: 'nameTest',
  }

  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: user,
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const loginForm = page.getByTestId('loginForm')

    await expect(loginForm).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, user.username, user.password)

      const userStatus = page.getByTestId('userStatus')

      await expect(userStatus).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, user.username, 'wrong')

      const notificationElement = page.getByTestId('notification')

      await expect(notificationElement).toContainText('wrong username or password')
      await expect(notificationElement).toHaveCSS('color', 'rgb(255, 0, 0)')

      const userStatus = page.getByTestId('userStatus')

      await expect(userStatus).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    const blog = {
      title: 'titleTest',
      author: 'authorTest',
      url: 'urlTest',
    }

    beforeEach(async ({ page }) => {
      await loginWith(page, user.username, user.password)
    })

    test('a new blog can be created', async ({ page }) => {
      const newBlogButton = page.getByRole('button', { name: 'new blog' })

      await newBlogButton.click()

      const title = page.getByTestId('title')
      const author = page.getByTestId('author')
      const url = page.getByTestId('url')
      const createButton = page.getByRole('button', { name: 'create' })

      await title.fill(blog.title)
      await author.fill(blog.author)
      await url.fill(blog.url)
      await createButton.click()

      const blogList = page.getByTestId('blogList')

      await expect(blogList).toContainText(blog.title)
      await expect(blogList).toContainText(blog.author)
    })
  })
})
