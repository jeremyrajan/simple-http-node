const http = require('http');
const PORT = 9091;


const handleRequest = (req, res) => {
  if (req.url === '/health') {
    res.end('ok');
  }

  if (req.url === '/forwarded' && req.method.toUpperCase() === 'POST') {
    res.end('forwarded.');
  }
};

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log('Server running on port' + PORT);
});
