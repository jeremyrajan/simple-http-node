const Server = require('../src/index');

const health = (req, res) => {
  res.send({ status: 'ok' });
};

const routes = (router) => {
  router.get('/', (req, res) => {
    res.send('home');
  });

  router.get('/health', health);

  router.post('/me', (req, res) => {
    res.send({ you: 'is' });
  });
}

const app = new Server({
  routes: routes,
  headers: {
    me: 'you'
  }
});

app.listen(9090, (err, server, port) => {
  console.log('running on port', port);
});


/**
 * For benchmarking.
 */
// const http = require('http');

// const handler = (req, res) => {
//   if (req.url === '/' && req.method === 'GET') {
//     res.end('test');
//   }
// }

// const server = http.createServer(handler);
// server.listen(8080, () => {
//   console.log('running at', 8080);
// });