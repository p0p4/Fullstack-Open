import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    removeNotification() {
      return ''
    },
  },
})

let notificationTimeout
export const addNotification = (message, milliseconds) => {
  return async (dispatch) => {
    dispatch(setNotification(message))
    if (notificationTimeout) {
      clearTimeout(notificationTimeout)
    }
    notificationTimeout = setTimeout(() => {
      dispatch(removeNotification())
    }, milliseconds)
  }
}

export const { setNotification, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer
