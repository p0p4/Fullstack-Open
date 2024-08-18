const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  // console.log(blogs)
  const blogLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
  // console.log(blogLikes)

  return blogLikes
}

const favoriteBlog = (blogs) => {
  const mostLikes = Math.max(...blogs.map((blog) => blog.likes))
  const favorite = blogs.find((blog) => blog.likes === mostLikes)
  // console.log(favorite)

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  }
}

const mostBlogs = (blogs) => {
  // const authors = blogs.reduce((acc, blog) => {
  //   acc[blog.author] = acc[blog.author] ? acc[blog.author] + 1 : 1
  //   return acc
  // }, {})
  // maxBlogs = Math.max(...Object.values(authors))

  // const author = Object.keys(authors).find((author) => authors[author] === maxBlogs)

  // return {
  //   author: author,
  //   blogs: authors[author],
  // }

  const author = _.chain(blogs)
    .countBy('author')
    .map((blogs, author) => ({ author, blogs }))
    .maxBy('blogs')
    .value()

  return author
}

const mostLikes = (blogs) => {
  const authors = blogs.reduce((acc, blog) => {
    acc[blog.author] = acc[blog.author] ? (acc[blog.author] += blog.likes) : blog.likes
    return acc
  }, {})

  const [author, likes] = Object.entries(authors).reduce((max, entry) => (entry[1] > max[1] ? entry : max))

  return {
    author,
    likes,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
