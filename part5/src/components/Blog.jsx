import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleLike = () => {
    updateBlog({
      ...blog,
      likes: blog.likes + 1,
    })
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog)
    }
  }

  return (
    <div style={blogStyle}>
      <span>{blog.title} </span>
      <span>{blog.author}</span>
      <button onClick={toggleVisibility} style={hideWhenVisible}>
        view
      </button>
      <button onClick={toggleVisibility} style={showWhenVisible}>
        hide
      </button>
      <div className='blogDetails' style={showWhenVisible}>
        <a href={blog.url}>{blog.url}</a>
        <br />
        <span>likes {blog.likes}</span>
        <button onClick={handleLike}>like</button>
        <div>{blog.user.name}</div>
        <button onClick={handleDelete}>remove</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
}

export default Blog
