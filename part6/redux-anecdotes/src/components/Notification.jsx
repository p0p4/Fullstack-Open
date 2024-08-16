import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification)
  const display = notification === '' ? 'none' : ''
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    display,
  }
  return <div style={style}>{notification}</div>
}

export default Notification
