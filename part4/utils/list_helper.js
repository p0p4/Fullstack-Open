const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  // console.log(blogs)
  const blogLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
  // console.log(blogLikes)

  return blogLikes
}

module.exports = {
  dummy,
  totalLikes,
}
