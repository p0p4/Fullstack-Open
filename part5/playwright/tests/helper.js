const loginWith = async (page, username, password) => {
  const loginForm = page.getByTestId('loginForm')
  const usernameField = page.getByTestId('username')
  const passwordField = page.getByTestId('password')
  const loginButton = loginForm.getByRole('button', { name: 'login' })

  await usernameField.fill(username)
  await passwordField.fill(password)
  await loginButton.click()
}

const createBlog = async (page, blog) => {
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

  await page.getByText(blog.title).waitFor()
}

export { loginWith, createBlog }
