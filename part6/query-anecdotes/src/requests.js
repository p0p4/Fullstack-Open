import axios from 'axios'

const baseUrl = '/anecdotes'

export const getAnecdotes = () => axios.get(baseUrl).then((res) => res.data)

export const createAnecdote = (object) => axios.post(baseUrl, object).then((res) => res.data)
