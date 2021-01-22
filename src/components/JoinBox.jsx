import React from 'react';
// import { useHistory } from 'react-router-dom';
import { Button, Card, Form } from 'react-bootstrap';
import axios from 'axios';
// import socket from '../socket';

function JoinBox({ onLogin }) {
  const roomIdRef = React.useRef();
  const usernameRef = React.useRef();
  // const passwordRef = React.useRef();
  // const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  // const history = useHistory();

  async function handleSubmit() {
    setLoading(true);

    const obj = {
      roomId: roomIdRef.current.value,
      username: usernameRef.current.value,
      // password: passwordRef.current.value,
    };

    await axios.post('/rooms', obj);
    onLogin(obj);
  }

  return (
    <Card>
      <Card.Body>
        {/* {error && <Alert variant='danger'>{error}</Alert>} */}
        <Form>
          <Form.Group>
            <Form.Label>Room ID</Form.Label>
            <Form.Control
              disabled={loading}
              type='text'
              placeholder='Enter room ID'
              ref={roomIdRef}
              required
            />
          </Form.Group>
          {/* <Form.Group>
            <Form.Label>Room Password</Form.Label>
            <Form.Control
              disabled={loading}
              type='password'
              placeholder='Enter room password'
              ref={passwordRef}
              required
            />
          </Form.Group> */}
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              disabled={loading}
              type='text'
              placeholder='Enter name'
              ref={usernameRef}
              required
            />
          </Form.Group>
          <Button
            disabled={loading}
            type='submit'
            className='w-100'
            variant='dark'
            onClick={handleSubmit}
          >
            Join
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default JoinBox;
