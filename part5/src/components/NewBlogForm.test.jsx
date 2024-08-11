import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogForm from './NewBlogForm'

describe('<NewBlogForm />', () => {
  test('event handler is called correctly', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    const blog = {
      title: 'testTitle',
      author: 'testAuthor',
      url: 'testUrl',
    }

    render(<NewBlogForm createBlog={createBlog} />)

    const inputs = screen.getAllByRole('textbox')
    const createButton = screen.getByText('create')

    await user.type(inputs[0], blog.title)
    await user.type(inputs[1], blog.author)
    await user.type(inputs[2], blog.url)
    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual(blog)
  })
})
