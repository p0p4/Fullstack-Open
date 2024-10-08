import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const notificationTimeout = useRef(null)
  const blogFormRef = useRef()

  const initUser = () => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }

  const fetchBlogs = async () => {
    const blogs = await blogService.getAll()
    setBlogs(blogs.sort((a, b) => b.likes - a.likes))
  }

  useEffect(() => {
    initUser()
    fetchBlogs()
  }, [])

  const showNotification = ({ text, color, time = 5000 }) => {
    setNotification({ text, color })
    clearTimeout(notificationTimeout.current)
    notificationTimeout.current = setTimeout(() => {
      setNotification(null)
    }, time)
  }

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
      showNotification({
        text: `${user.name} logged in`,
        color: 'green',
      })
    } catch (exception) {
      if (exception.response.status === 401) {
        showNotification({
          text: 'wrong username or password',
          color: 'red',
        })
      } else {
        console.error(exception)
      }
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)

    showNotification({
      text: `${user.name} logged out`,
      color: 'green',
    })
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()

      const newBlog = await blogService.create(blogObject)
      fetchBlogs()

      showNotification({
        text: `a new blog ${newBlog.title} by ${newBlog.author} added`,
        color: 'green',
      })
    } catch (exception) {
      if (exception.response.status === 400) {
        showNotification({
          text: 'missing title or url',
          color: 'red',
        })
      } else {
        console.error(exception)
      }
    }
  }

  const updateBlog = async (blogObject) => {
    try {
      // this await only returns a user id instead of a nested user object
      await blogService.update(blogObject.id, blogObject)
      // we only implemented the nesting for the get blogs route so it's used
      fetchBlogs()
    } catch (exception) {
      console.error(exception)
    }
  }

  const deleteBlog = async (blogObject) => {
    try {
      await blogService.remove(blogObject.id)
      fetchBlogs()
      showNotification({
        text: `blog ${blogObject.title} by ${blogObject.author} removed`,
        color: 'green',
      })
    } catch (exception) {
      if (exception.response.status === 401) {
        showNotification({
          text: 'unauthorized request',
          color: 'red',
        })
      } else {
        console.error(exception)
      }
    }
  }

  const loginForm = () => (
    <form data-testid='loginForm' onSubmit={handleLogin}>
      <label>username:</label>
      <input
        data-testid='username'
        type='text'
        value={username}
        onChange={({ target }) => setUsername(target.value)}
      />
      <br />
      <label>password:</label>
      <input
        data-testid='password'
        type='password'
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />
      <br />
      <button type='submit'>login</button>
    </form>
  )

  const userStatus = () => (
    <form data-testid='userStatus' onSubmit={handleLogout}>
      <label>{user.name} logged in</label>
      <button type='submit'>logout</button>
    </form>
  )

  const blogList = () => (
    <div data-testid='blogList'>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
          user={user}
        />
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
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <NewBlogForm addBlog={addBlog} />
      </Togglable>
      {blogList()}
    </>
  )
}

export default App
