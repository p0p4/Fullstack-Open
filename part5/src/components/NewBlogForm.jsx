import { useState } from 'react'
import PropTypes from 'prop-types'

const NewBlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleAddBlog = (event) => {
    event.preventDefault()

    addBlog({
      title,
      author,
      url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleAddBlog}>
      <h2>create new</h2>
      <label>title:</label>
      <input
        type='text'
        value={title}
        onChange={({ target }) => setTitle(target.value)}
        placeholder='enter title...'
      />
      <br />
      <label>author:</label>
      <input
        type='text'
        value={author}
        onChange={({ target }) => setAuthor(target.value)}
        placeholder='enter author...'
      />
      <br />
      <label>url:</label>
      <input
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

NewBlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired,
}

export default NewBlogForm
