import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { describe, expect } from 'vitest'

describe('<Blog />', () => {
  test('renders initial content', () => {
    const blog = {
      title: 'testTitle',
      author: 'testAuthor',
      url: 'testUrl',
      likes: 1,
      user: {
        name: 'testName',
      },
    }

    const { container } = render(<Blog blog={blog} updateBlog={() => {}} deleteBlog={() => {}} />)

    console.log(screen.debug())

    // author and title are displayed
    expect(screen.getByText(blog.title)).toBeDefined()
    expect(screen.getByText(blog.author)).toBeDefined()

    // url and likes are not displayed
    expect(container.querySelector('.blogDetails')).toHaveStyle('display: none')
  })
})
