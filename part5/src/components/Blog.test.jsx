import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  const blog = {
    title: 'testTitle',
    author: 'testAuthor',
    url: 'testUrl',
    likes: 1,
    user: {
      name: 'testName',
    },
  }

  beforeEach(() => {
    container = render(<Blog blog={blog} updateBlog={() => {}} deleteBlog={() => {}} />).container
  })

  test('renders initial content', () => {
    // author and title are displayed
    expect(screen.getByText(blog.title)).toBeDefined()
    expect(screen.getByText(blog.author)).toBeDefined()

    // url and likes are not displayed
    expect(container.querySelector('.blogDetails')).toHaveStyle('display: none')
  })

  test('renders blog details after clicking the view button', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(container.querySelector('.blogDetails')).not.toHaveStyle('display: none')

    expect(screen.getByText(blog.url)).toBeDefined()
    expect(screen.getByText(`likes ${blog.likes}`)).toBeDefined()
  })
})
