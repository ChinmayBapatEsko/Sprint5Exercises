const tls = require('tls');
const fs = require('fs');

const options = {
  key: fs.readFileSync('keyServer.pem'),
  cert: fs.readFileSync('certServer.pem')
};

const server = tls.createServer(options, (socket) => {
  socket.on('data', (data) => {
    console.log('Received data from client:', data.toString());
    socket.write('Hello from the server!');
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });

  socket.on('error', (error) => {
    console.error('Server error:', error);
  });
});

server.listen(8000, () => {
  console.log('Server listening on port 8000');
});
