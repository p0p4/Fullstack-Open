const loginWith = async (page, username, password) => {
  const loginForm = page.getByTestId('loginForm')
  const usernameField = page.getByTestId('username')
  const passwordField = page.getByTestId('password')
  const loginButton = loginForm.getByRole('button', { name: 'login' })

  await usernameField.fill(username)
  await passwordField.fill(password)
  await loginButton.click()
}

export { loginWith }
