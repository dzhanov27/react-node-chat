import React from 'react';

import axios from 'axios';
import socket from './socket';

import JoinBox from './components/JoinBox';
import Chat from './components/Chat';
import reducer from './reducers/reducer';

function App() {
  const [state, dispatch] = React.useReducer(reducer, {
    joined: false,
    roomId: null,
    username: null,
    users: [],
    messages: [],
  });

  async function onLogin(obj) {
    dispatch({
      type: 'JOINED',
      payload: obj,
    });
    socket.emit('ROOM:JOIN', obj);
    const { data } = await axios.get(`/rooms/${obj.roomId}`);
    setUsers(data.users);
  }

  function setUsers(users) {
    dispatch({
      type: 'SET_USERS',
      payload: users,
    });
  }

  function addMessage(message) {
    dispatch({
      type: 'NEW_MESSAGE',
      payload: message,
    });
  }

  React.useEffect(() => {
    socket.on('ROOM:SET_USERS', setUsers);
    socket.on('ROOM:NEW_MESSAGE', addMessage);
  }, []);

  return (
    <div
      className='d-flex justify-content-center'
      style={{ maxHeight: '100vh' }}
    >
      <div className='w-100 pt-2' style={{ maxWidth: '400px' }}>
        {!state.joined ? (
          <JoinBox onLogin={onLogin} />
        ) : (
          <Chat {...state} onAddMessage={addMessage} />
        )}
      </div>
    </div>
  );
}

export default App;
