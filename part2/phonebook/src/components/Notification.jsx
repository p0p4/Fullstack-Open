const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  const messageStyle = {
    color: message.color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return <div style={messageStyle}>{message.text}</div>;
};

export default Notification;
