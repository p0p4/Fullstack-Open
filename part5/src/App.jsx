import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState(null)

  const notificationTimeout = useRef(null)

  const resetNotificationTimeout = (time = 5000) => {
    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current)
    }
    notificationTimeout.current = setTimeout(() => {
      setNotification(null)
    }, time)
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (!user && loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  })

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }

    fetchBlogs()
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      setNotification({
        text: `${user.name} logged in`,
        color: 'green',
      })
      resetNotificationTimeout(5000)
    } catch (exception) {
      if (exception.response.status === 401) {
        setNotification({
          text: 'wrong username or password',
          color: 'red',
        })
        resetNotificationTimeout(5000)
      } else {
        console.error(exception)
      }
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()

    setNotification({
      text: `${user.name} logged out`,
      color: 'green',
    })
    resetNotificationTimeout(5000)

    setUser(null)
    window.localStorage.removeItem('loggedBlogAppUser')
  }

  const addBlog = async (event) => {
    event.preventDefault()

    const blogObject = {
      title,
      author,
      url,
    }

    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      setTitle('')
      setAuthor('')
      setUrl('')

      setNotification({
        text: `a new blog ${newBlog.title} by ${newBlog.author} added`,
        color: 'green',
      })
      resetNotificationTimeout(5000)
    } catch (exception) {
      if (exception.response.status === 400) {
        setNotification({
          text: 'missing title or url',
          color: 'red',
        })
        resetNotificationTimeout(5000)
      } else {
        console.error(exception)
      }
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <label>username:</label>
      <input type='text' value={username} onChange={({ target }) => setUsername(target.value)} />
      <br />
      <label>password:</label>
      <input
        type='password'
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />
      <br />
      <button type='submit'>login</button>
    </form>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <h2>create new</h2>
      <label>title:</label>
      <input type='text' value={title} onChange={({ target }) => setTitle(target.value)} />
      <br />
      <label>author:</label>
      <input type='text' value={author} onChange={({ target }) => setAuthor(target.value)} />
      <br />
      <label>url:</label>
      <input type='text' value={url} onChange={({ target }) => setUrl(target.value)} />
      <br />
      <button type='submit'>create</button>
    </form>
  )

  const userStatus = () => (
    <form onSubmit={handleLogout}>
      <label>{user.name} logged in</label>
      <button type='submit'>logout</button>
    </form>
  )

  const blogList = () => (
    <div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )

  if (user === null) {
    return (
      <>
        <h2>Log in to application</h2>
        <Notification message={notification} />
        {loginForm()}
      </>
    )
  }

  return (
    <>
      <h2>Blogs</h2>
      <Notification message={notification} />
      {userStatus()}
      {blogForm()}
      {blogList()}
    </>
  )
}

export default App
