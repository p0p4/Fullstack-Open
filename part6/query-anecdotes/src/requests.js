import axios from 'axios'

const baseUrl = '/anecdotes'

export const getAnecdotes = () => axios.get(baseUrl).then((res) => res.data)
