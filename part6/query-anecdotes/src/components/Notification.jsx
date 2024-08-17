import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()

  const display = notification ? '' : 'none'
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
    display,
  }

  return <div style={style}>{notification}</div>
}

export default Notification
