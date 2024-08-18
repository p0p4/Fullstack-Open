const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes = 0 } = request.body

  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'invalid token' })
  } else if (!title || !url) {
    return response.status(400).json({ error: 'title and url are required' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user.id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes = 0 } = request.body

  const blog = {
    title,
    author,
    url,
    likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'invalid token' })
  }

  const blog = await Blog.findById(request.params.id)

  if (blog && blog.user.toString() !== user.id) {
    return response.status(401).json({ error: 'Unauthorized request' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter
