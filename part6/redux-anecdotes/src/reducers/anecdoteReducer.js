import { createSlice } from '@reduxjs/toolkit'

const getId = () => (100000 * Math.random()).toFixed(0)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      const newAnecdote = {
        content: action.payload,
        id: getId(),
        votes: 0,
      }
      return [...state, newAnecdote]
    },
    addVote(state, action) {
      const id = action.payload
      const anecdoteToChange = state.find((anecdote) => anecdote.id === id)
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1,
      }
      return state.map((anecdote) => (anecdote.id !== id ? anecdote : changedAnecdote))
    },
    setAnecdotes(state, action) {
      return action.payload
    },
  },
})

export const { createAnecdote, addVote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer
