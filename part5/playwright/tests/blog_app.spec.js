const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  const user = {
    username: 'usernameTest',
    password: 'password',
    name: 'nameTest',
  }

  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: user,
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const loginForm = page.getByTestId('loginForm')

    await expect(loginForm).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      const loginForm = page.getByTestId('loginForm')
      const username = page.getByTestId('username')
      const password = page.getByTestId('password')
      const loginButton = loginForm.getByRole('button', { name: 'login' })

      await username.fill(user.username)
      await password.fill(user.password)
      await loginButton.click()

      const userStatus = page.getByTestId('userStatus')

      await expect(userStatus).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      const loginForm = page.getByTestId('loginForm')
      const username = page.getByTestId('username')
      const password = page.getByTestId('password')
      const loginButton = loginForm.getByRole('button', { name: 'login' })

      await username.fill(user.username)
      await password.fill('wrong')
      await loginButton.click()

      const notificationElement = page.getByTestId('notification')

      await expect(notificationElement).toContainText('wrong username or password')
      await expect(notificationElement).toHaveCSS('color', 'rgb(255, 0, 0)')

      const userStatus = page.getByTestId('userStatus')

      await expect(userStatus).not.toBeVisible()
    })
  })
})
