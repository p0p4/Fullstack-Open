import React, { useState } from 'react'

const NewBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title,
      author,
      url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
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
}

export default NewBlogForm
