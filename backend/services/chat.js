const { Server } = require('socket.io');
const Message = require('../models/Message');

function initChat(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
    });

    socket.on('send_message', async (data) => {
      try {
        const { sender, receiver, content, roomId } = data;
        const message = await Message.create({ sender, receiver, content, roomId });
        const populated = await message.populate('sender', 'name avatar');
        io.to(roomId).emit('receive_message', populated);
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('typing', (data) => {
      socket.to(data.roomId).emit('user_typing', { userId: data.userId });
    });

    socket.on('stop_typing', (data) => {
      socket.to(data.roomId).emit('user_stop_typing', { userId: data.userId });
    });
  });

  return io;
}

module.exports = initChat;
