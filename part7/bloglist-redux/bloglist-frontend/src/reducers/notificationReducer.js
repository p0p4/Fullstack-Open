import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    showNotification(state, action) {
      return action.payload
    },
    hideNotification() {
      return null
    },
  },
})

export const { showNotification, hideNotification } = notificationSlice.actions

let notificationTimeout
export const setNotification = (message, seconds = 5) => {
  return (dispatch) => {
    dispatch(showNotification(message))
    if (notificationTimeout) clearTimeout(notificationTimeout)
    notificationTimeout = setTimeout(() => {
      dispatch(hideNotification())
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
