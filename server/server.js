const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let currentPage = 1; // Keep track of the current page

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send the current page to the newly connected client
  socket.emit('pageChanged', currentPage);

  // Listen for page changes from the admin
  socket.on('changePage', (page) => {
    currentPage = page; // Update the server's current page state
    io.emit('pageChanged', page); // Broadcast the page change to all clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});