const tls = require('tls');
const fs = require('fs');

const options = {
  host: 'localhost',
  port: 8000,
  key: fs.readFileSync('keyClient.pem'),
  cert: fs.readFileSync('certClient.pem'),
  ca: [fs.readFileSync('certServer.pem')], // Assuming the client trusts the server's cert
  rejectUnauthorized: true // Ensuring the server's certificate is validated
};

const client = tls.connect(options, () => {
  console.log('Connected to server');
  client.write('Hello from the client!');
});

client.on('data', (data) => {
  console.log('Received data from server:', data.toString());
  client.end();
});

client.on('end', () => {
  console.log('Disconnected from server');
});

client.on('error', (error) => {
  console.error('Client error:', error);
});
