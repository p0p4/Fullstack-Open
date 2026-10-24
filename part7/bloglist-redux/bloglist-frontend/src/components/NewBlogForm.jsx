import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { appendBlog } from '../reducers/blogReducer'
import { showNotification } from '../reducers/notificationReducer'

const NewBlogForm = () => {
  const dispatch = useDispatch

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleAddBlog = (event) => {
    event.preventDefault()

    const blogObject = {
      title,
      author,
      url,
    }

    try {
      dispatch(appendBlog(blogObject))

      showNotification({
        text: `a new blog ${blogObject.title} by ${blogObject.author} added`,
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

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form data-testid='newBlogForm' onSubmit={handleAddBlog}>
      <h2>create new</h2>
      <label>title:</label>
      <input
        data-testid='title'
        type='text'
        value={title}
        onChange={({ target }) => setTitle(target.value)}
        placeholder='enter title...'
      />
      <br />
      <label>author:</label>
      <input
        data-testid='author'
        type='text'
        value={author}
        onChange={({ target }) => setAuthor(target.value)}
        placeholder='enter author...'
      />
      <br />
      <label>url:</label>
      <input
        data-testid='url'
        type='text'
        value={url}
        onChange={({ target }) => setUrl(target.value)}
        placeholder='enter url...'
      />
      <br />
      <button type='submit'>create</button>
    </form>
  )
}

export default NewBlogForm
