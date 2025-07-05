const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Helper to log current client count
const logClientCount = () => {
  const count = io.sockets.sockets.size;
  console.log(`Connected clients: ${count}`);
};

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);
  logClientCount();

  socket.on('nextQuestion', () => {
    socket.broadcast.emit('nextQuestion');
  });

  socket.on('prevQuestion', () => {
    socket.broadcast.emit('prevQuestion');
  });

  socket.on('updateQuestion', () => {
    socket.broadcast.emit('updateQuestion');
  });

  socket.on('selectSurvey', (sid) => {
    socket.broadcast.emit('selectSurvey', sid);
  });

  socket.on('selectGraph', (gid) => {
    socket.broadcast.emit('selectGraph', gid);
  });

  socket.on('disconnect', () => {
    console.log(`❌ A user disconnected: ${socket.id}`);
    logClientCount();
  });
});

server.listen(4000, () => {
  console.log('🚀 Socket.IO server running on http://localhost:4000');
});
