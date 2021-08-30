import express from 'express';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import http from 'http';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (_, res) => res.render('home'));
app.get('/*', (_, res) => res.redirect('/'));
const handleListen = () => console.log(`Listening on http://localhost:3000`);

//http server
const httpServer = http.createServer(app);
//socket.io server
const wsServer = new Server(httpServer, {
  cors: {
    origin: ['https://admin.socket.io'],
    credentials: true,
  },
});
instrument(wsServer, {
  auth: false,
});
function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on('connection', (socket) => {
  socket['nickname'] = `익명 ${Date.now()}`;
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on('enter_room', (roomName, nickname, done) => {
    socket['nickname'] = nickname;
    socket.join(roomName);
    done();
    socket
      .to(roomName)
      .emit(
        'welcome',
        socket.nickname,
        socket.handshake.time,
        countRoom(roomName)
      );
    wsServer.sockets.emit('room_change', publicRooms());
  });
  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit('bye', socket.nickname, countRoom(room) - 1)
    );
  });
  socket.on('disconnect', () => {
    wsServer.sockets.emit('room_change', publicRooms());
  });
  socket.on('new_message', (msg, room, done) => {
    socket.to(room).emit('new_message', `${socket.nickname} : ${msg}`);
    done();
  });
  socket.on('nickname', (nickname) => (socket['nickname'] = nickname));
});

//websocketServer
// const wss = new WebSocket.Server({ server });
//socket은 서버와 브라우저사이의 연결

// const sockets = [];

// wss.on('connection', (socket) => {
//   sockets.push(socket);
//   socket['nickname'] = `익명 ${Date.now()}`;
//   console.log('Connected To Browser');
//   socket.on('close', () => console.log('DisConnection from the Browser!!'));
//   socket.on('message', (msg) => {
//     const message = JSON.parse(msg);
//     switch (message.type) {
//       case 'new_message':
//         sockets.forEach((aSocket) =>
//           aSocket.send(
//             `${socket.nickname}: ${message.payload.toString('utf-8')}`
//           )
//         );
//         break;
//       case 'nickname':
//         socket['nickname'] = message.payload;
//         break;

//       default:
//         break;
//     }
//   });
// });
httpServer.listen(3000, handleListen);
