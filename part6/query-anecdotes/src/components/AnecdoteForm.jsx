import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'

import { useNotificationDispatch } from '../NotificationContext'

const generateId = () => Number((Math.random() * 100000).toFixed(0))

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()

  const newNoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    },
    onError: (error) => {
      const payload = { message: error.response.data.error, seconds: 5 }
      notificationDispatch({ type: 'SHOW', payload })
    },
  })

  const onCreate = (event) => {
    event.preventDefault()

    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newNoteMutation.mutate({ content, id: generateId().toString(), votes: 0 })

    const payload = { message: `anecdote '${content}' created`, seconds: 5 }
    notificationDispatch({ type: 'SHOW', payload })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
