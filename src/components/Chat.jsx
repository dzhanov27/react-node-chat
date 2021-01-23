import React from 'react';
import socket from '../socket';
import { Button, Form, Navbar, Alert } from 'react-bootstrap';

function Chat({ users, messages, username, roomId, onAddMessage }) {
  const [messageValue, setMessageValue] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const messagesRef = React.createRef();

  // function scrollToBottom() {
  //   messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  // }

  function onSendMessage() {
    socket.emit('ROOM:NEW_MESSAGE', {
      roomId,
      username,
      text: messageValue,
    });
    onAddMessage({
      username,
      text: messageValue,
    });
    setMessageValue('');
  }

  React.useEffect(() => {
    messagesRef.current.scrollTo(0, 99999);
  }, [messages]);

  return (
    <div>
      <Navbar
        bg='dark'
        variant='dark'
        className='d-flex justify-content-between'
      >
        <span className='navbar-brand mb-0 h1'>Room: {roomId}</span>
        <Button
          variant='outline-light'
          onClick={() => {
            setVisible(!visible);
          }}
        >
          {visible ? 'Chat' : 'Users'}
        </Button>
      </Navbar>
      {visible ? (
        <div
          className='my-2'
          style={{ overflowY: 'scroll', height: '69vh' }}
          ref={messagesRef}
        >
          <div className='col-11 px-0'>
            {users.map((user, index) => (
              <div className='media-body ml-3'>
                <Alert key={user + index} variant='success'>
                  {user}
                </Alert>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className='my-2'
          style={{ overflowY: 'scroll', height: '60vh' }}
          ref={messagesRef}
        >
          <div className='col-9 px-0'>
            {messages.map((message, index) => (
              <div className='media-body ml-3' key={index + message}>
                <div className='bg-dark rounded py-2 px-3 mb-2'>
                  <p className='text-small mb-0 text-white'>{message.text}</p>
                </div>
                <p className='small text-dark'>{message.username}</p>
              </div>
            ))}
          </div>

          {/* <div className='media w-50 ml-auto mb-3'>
          <div className='media-body'>
            <div className='bg-dark rounded py-2 px-3 mb-2'>
              <p className='text-small mb-0 text-white'>
                Test which is a new approach to have all solutions
              </p>
            </div>
            <p className='small text-muted'>Me</p>
          </div>
        </div> */}
        </div>
      )}

      <Form className=''>
        <Form.Group>
          <Form.Control
            as='textarea'
            rows={3}
            value={messageValue}
            onChange={(e) => {
              setMessageValue(e.target.value);
            }}
          />
        </Form.Group>
        <Button
          // disabled={loading}
          variant='dark'
          onClick={onSendMessage}
        >
          Send
        </Button>
      </Form>
    </div>
  );
}

export default Chat;
