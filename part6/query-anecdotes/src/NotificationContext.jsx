import { createContext, useReducer, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW':
      return action.payload
    case 'HIDE':
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, null)

  useEffect(() => {
    if (notification && notification.seconds) {
      const notificationTimeout = setTimeout(() => {
        notificationDispatch({ type: 'HIDE' })
      }, notification.seconds * 1000)

      return () => clearTimeout(notificationTimeout)
    }
  }, [notification])

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const valueAndDispatch = useContext(NotificationContext)
  return valueAndDispatch[0]?.message || null
}

export const useNotificationDispatch = () => {
  const valueAndDispatch = useContext(NotificationContext)
  return valueAndDispatch[1]
}

NotificationContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default NotificationContext
