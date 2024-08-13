const loginWith = async (page, username, password) => {
  const loginForm = await page.getByTestId('loginForm')
  const usernameField = await loginForm.getByTestId('username')
  const passwordField = await loginForm.getByTestId('password')
  const loginButton = await loginForm.getByRole('button', { name: 'login' })

  await usernameField.fill(username)
  await passwordField.fill(password)
  await loginButton.click()
}

const createBlog = async (page, blog) => {
  const newBlogButton = await page.getByRole('button', { name: 'new blog' })
  const title = await page.getByTestId('title')
  const author = await page.getByTestId('author')
  const url = await page.getByTestId('url')
  const newBlogForm = await page.getByTestId('newBlogForm')
  const createButton = await newBlogForm.getByRole('button', { name: 'create' })

  await newBlogButton.click()
  await title.fill(blog.title)
  await author.fill(blog.author)
  await url.fill(blog.url)
  await createButton.click()

  await page.getByText(`${blog.title} ${blog.author}`).waitFor()
}

export { loginWith, createBlog }
