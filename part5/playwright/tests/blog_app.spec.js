const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')
const { title } = require('process')

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
      const userStatus = page.getByTestId('userStatus')

      await loginWith(page, user.username, user.password)

      await expect(userStatus).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      const notificationElement = page.getByTestId('notification')
      const userStatus = page.getByTestId('userStatus')

      await loginWith(page, user.username, 'wrong')

      await expect(notificationElement).toContainText('wrong username or password')
      await expect(notificationElement).toHaveCSS('color', 'rgb(255, 0, 0)')

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
      const blogList = page.getByTestId('blogList')
      const title = page.getByTestId('title')
      const author = page.getByTestId('author')
      const url = page.getByTestId('url')
      const createButton = page.getByRole('button', { name: 'create' })

      await newBlogButton.click()

      await title.fill(blog.title)
      await author.fill(blog.author)
      await url.fill(blog.url)
      await createButton.click()

      await expect(blogList).toContainText(blog.title)
      await expect(blogList).toContainText(blog.author)
    })

    describe('and a blogs exists', () => {
      const blogs = []
      beforeEach(async ({ page }) => {
        const blogCount = 3
        for (let i = 0; i < blogCount; i++) {
          blogs.push({
            title: `titleTest${i}`,
            author: `authorTest${i}`,
            url: `urlTest${i}`,
          })
          await createBlog(page, blogs[i])
        }
      })

      test('a blog can be liked', async ({ page }) => {
        const blogList = page.getByTestId('blogList')
        const blog = blogList.locator('div').filter({ hasText: blogs[0].title })
        const viewButton = blog.getByRole('button', { name: 'view' })
        const likeButton = blog.getByRole('button', { name: 'like' })

        await viewButton.click()

        await likeButton.click()

        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('a blog can be deleted', async ({ page }) => {
        const blogList = page.getByTestId('blogList')
        const blog = blogList.locator('div').filter({ hasText: blogs[0].title })
        const viewButton = blog.getByRole('button', { name: 'view' })
        const deleteButton = blog.getByRole('button', { name: 'remove' })

        await viewButton.click()

        expect(blog).toContainText(user.name)

        page.on('dialog', async (dialog) => {
          await dialog.accept()
        })
        await deleteButton.click()

        await expect(blogList).not.toContainText(blogs[0].title)
      })
    })
  })
})
