const express = require('express');
const path = require('path');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });

app.use(express.static(path.join(__dirname, './build')));
app.use(express.json());

const PORT = process.env.PORT || 5000;

const rooms = new Map();

app.get('/rooms/:id', (req, res) => {
  const { id: roomId } = req.params;
  const obj = rooms.has(roomId)
    ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()],
      }
    : {
        users: [],
        messages: [],
      };
  res.json(obj);
});

app.post('/rooms', (req, res) => {
  const { roomId, username } = req.body;
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ['users', new Map()],
        ['messages', []],
      ])
    );
  }
  res.send();
});

io.on('connection', (socket) => {
  socket.on('ROOM:JOIN', ({ roomId, username }) => {
    socket.join(roomId);
    rooms.get(roomId).get('users').set(socket.id, username);
    const users = [...rooms.get(roomId).get('users').values()];
    socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users);
  });

  socket.on('ROOM:NEW_MESSAGE', ({ roomId, username, text }) => {
    const obj = { username, text };
    rooms.get(roomId).get('messages').push(obj);
    socket.to(roomId).broadcast.emit('ROOM:NEW_MESSAGE', obj);
  });

  socket.on('disconnect', () => {
    rooms.forEach((value, roomId) => {
      if (value.get('users').delete(socket.id)) {
        const users = [...value.get('users').values()];
        socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users);
        console.log('user disconnected');
      }
    });
  });
  console.log('user connected', socket.id);
});

server.listen(PORT, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log(`Server has been started on port ${PORT}`);
});
