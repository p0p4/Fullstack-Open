const dummy = (blogs) => {
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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
