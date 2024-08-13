const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  const user = {
    username: 'usernameTest',
    password: 'password',
    name: 'nameTest',
  }
  const userTwo = {
    username: 'usernameTest2',
    password: 'password2',
    name: 'nameTest2',
  }

  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: user,
    })
    await request.post('/api/users', {
      data: userTwo,
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const loginForm = await page.getByTestId('loginForm')

    await expect(loginForm).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      const userStatus = await page.getByTestId('userStatus')

      await loginWith(page, user.username, user.password)

      await expect(userStatus).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      const notificationElement = await page.getByTestId('notification')
      const userStatus = await page.getByTestId('userStatus')

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
      const blogList = await page.getByTestId('blogList')
      await createBlog(page, blog)

      await expect(blogList).toContainText(blog.title)
      await expect(blogList).toContainText(blog.author)
    })

    describe('and a blogs exists', () => {
      const blogs = []
      beforeEach(async ({ page }) => {
        blogs.length = 0
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
        const blogList = await page.getByTestId('blogList')
        const blog = await blogList.locator('div').filter({ hasText: blogs[2].title })
        const viewButton = await blog.getByRole('button', { name: 'view' })
        const likeButton = await blog.getByRole('button', { name: 'like' })

        await viewButton.click()
        await likeButton.click()

        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('a blog can be deleted', async ({ page }) => {
        const blogIndex = 2
        const blogList = await page.getByTestId('blogList')
        const blog = await blogList.locator('div').filter({ hasText: blogs[blogIndex].title })
        const viewButton = await blog.getByRole('button', { name: 'view' })
        const deleteButton = await blog.getByRole('button', { name: 'remove' })

        await viewButton.click()

        await expect(blog).toContainText(user.name)

        page.on('dialog', async (dialog) => {
          await dialog.accept()
        })
        await deleteButton.click()

        await expect(blogList).not.toContainText(blogs[blogIndex].title)
      })

      test('delete button is only shown to the creator', async ({ page }) => {
        const blogIndex = 0
        const blogList = await page.getByTestId('blogList')
        const blog = await blogList.locator('div').filter({ hasText: blogs[blogIndex].title })
        const viewButton = await blog.getByRole('button', { name: 'view' })
        const deleteButton = await blog.getByRole('button', { name: 'remove' })
        const logOutButton = await page.getByRole('button', { name: 'logout' })

        await viewButton.click()

        await expect(blog).toContainText(user.name)
        await expect(deleteButton).toBeVisible()

        await logOutButton.click()
        await loginWith(page, userTwo.username, userTwo.password)

        await viewButton.click()

        await expect(blog).not.toContainText(userTwo.name)
        await expect(deleteButton).not.toBeVisible()
      })

      test('blogs are ordered by likes', async ({ page }) => {
        const blogList = await page.getByTestId('blogList')
        const blogElements = await blogList.locator('> div')

        const count = await blogElements.count()
        for (let i = 0; i < count; ++i) {
          const blog = await blogElements.filter({ hasText: blogs[i].title })
          const viewButton = await blog.getByRole('button', { name: 'view' })
          const likeButton = await blog.getByRole('button', { name: 'like' })

          await viewButton.click()

          // add likes in reverse order
          for (let j = 0; j <= i; ++j) {
            await likeButton.click()
            await blog.getByText(`likes ${j + 1}`).waitFor()
          }
        }

        // check that blogs are ordered by likes ascending
        for (let i = 0; i < count; ++i) {
          const blog = await blogElements.nth(i)
          await expect(blog).toContainText(`likes ${count - i}`)
        }
      })
    })
  })
})
