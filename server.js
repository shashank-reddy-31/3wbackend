// server.js  
const express = require('express');  
const http = require('http');  
const socketIo = require('socket.io');  
const mongoose = require('mongoose');  
const cors = require('cors');  

const app = express();  
const server = http.createServer(app);  
const io = socketIo(server);  

app.use(cors());  
app.use(express.json());  

// Connect to MongoDB  
mongoose.connect('mongodb://localhost:27017/chat-app', {  
  useNewUrlParser: true,  
  useUnifiedTopology: true  
});  

const messageSchema = new mongoose.Schema({  
  room: String,  
  username: String,  
  message: String,  
  timestamp: { type: Date, default: Date.now }  
});  

const Message = mongoose.model('Message', messageSchema);  

// Socket.io logic  
io.on('connection', (socket) => {  
  console.log('New user connected');  

  socket.on('joinRoom', ({ username, room }) => {  
    socket.join(room);  
    socket.to(room).emit('message', { user: 'Admin', text: `${username} has joined!` });  

    // Load previous messages from the database  
    Message.find({ room }).sort({ timestamp: -1 }).limit(50)  
      .then(messages => socket.emit('loadMessages', messages.reverse()));  
  });  

  socket.on('chatMessage', ({ room, username, message }) => {  
    const newMessage = new Message({ room, username, message });  
    newMessage.save().then(() => {  
      io.to(room).emit('message', { user: username, text: message, timestamp: newMessage.timestamp });  
    });  
  });  

  socket.on('typing', (room, username) => {  
    socket.to(room).emit('typing', username);  
  });  

  socket.on('disconnect', () => {  
    console.log('User disconnected');  
  });  
});  

const PORT = process.env.PORT || 5000;  
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));