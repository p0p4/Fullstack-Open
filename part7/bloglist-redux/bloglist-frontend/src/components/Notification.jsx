import { useSelector } from 'react-redux'

const Notification = () => {
  const message = useSelector((state) => state.notification)
  if (message === null) {
    return null
  }

  const messageStyle = {
    color: message.color || 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div data-testid='notification' style={messageStyle}>
      {message.text}
    </div>
  )
}

export default Notification
