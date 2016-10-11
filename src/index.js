/**
 * Simple-http-node is thin wrapper around nodejs http library.
 * The focus here is to provide a very thin api for REST applications.
 * ** THIS IS STILL WORK IN PROGRESS. Please dont use it in your production applications. **
 */

const http = require('http');
 
// monitor all the running instances
const runningInstances = [];

// show a console message
const message = (type = 'info', message) => {
  console[type](message);
};

/**
 * Set response headers
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Object} headers
 */
const setHeaders = (req, res, headers) => {
  Object.keys(headers).forEach((h) => {
    res.setHeader(h, headers[h]);
  });
}

/**
 * Not found or 404 handler (Yet to be included.)
 * 
 * @param {Object} req
 * @param {Object} res
 */
const notFound = (req, res) => {
  res.statusCode = 404;
  res.end('404 not found!');
}

/**
 * POST request handler
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {String} route
 * @param {Function} fn
 */
const post = (req, res, route, fn) => {
  if (req.url === route && req.method.toUpperCase() === 'POST') {
    exposeBody(req, res, () => fn(req, res));
  }
}

/**
 * GET request handler
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {String} route example '/hello'
 * @param {Function} fn
 */
const get = (req, res, route, fn) => {
  if (req.url === route && req.method.toUpperCase() === 'GET') {
    fn(req, res);
  }
}

/**
 * Sets up the routing as per the dynamic routes defined.
 * 
 * @param {Object} req
 * @param {Object} res
 * @returns {Object}
 */
const router = (req, res) => {
  return({
    get: get.bind(this, req, res),
    post: post.bind(this, req, res)
  });
}

/**
 * Listening to the body being sent during POST
 * and makes it available in req.body. similar
 * to what express does.
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} callback
 * @returns
 */
const exposeBody = (req, res, callback) => {
  if (req.method.toUpperCase() !== 'POST') {
    return callback();
  }

  let JSONstring = '';

  req.on('data', (data) => {
    JSONstring += data;
  });

  req.on('end', () => {
    req.body = JSONstring;
    return callback();
  });
};

/**
 * Sends a request back to the client.
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Object} headers
 * @param {Object|String} body
 */
const send = (req, res, headers, body) => {
  setHeaders(req, res, headers);
  if (typeof body === 'object') {
    res.end(JSON.stringify(body));
  } else {
    res.end(body);
  }
}

/**
 * Sets a status of the response. The status should be
 * a number.
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Number} statusNum
 * @returns
 */
const status = (req, res, statusNum) => {
  if (typeof statusNum !== 'number') {
    return;
  }

  res.statusCode = statusNum;

  // returns .json and .send methods. Ex: res.status(200).send('A ok!')
  return ({
    json: send.bind(this, req, res),
    send: send.bind(this, req, res)
  });
}

class Server {
  /**
   * Creates an instance of Server.
   * 
   * @param {Object} opts
   * 
   * @memberOf Server
   */
  constructor(opts) {
    this.routes = opts.routes;
    this.headers = opts.headers;
    this.server = http.createServer(this.handler.bind(this));
  }

  /**
   * The request and response handler. It binds a methods such as
   * send or json, similar to express.
   * @param {Object} req
   * @param {Object} res
   * 
   * @memberOf Server
   */
  handler(req, res) {
    res.send = send.bind(this, req, res, this.headers);
    res.json = send.bind(this, req, res);
    res.status = status.bind(this, req, res);
    this.routes(router(req, res));
  }

  /**
   * Starting listening to a port number. Defaults to 8080
   * 
   * @param {number} [PORT=8080]
   * @param {function} fn
   * 
   * @memberOf Server
   */
  listen(PORT = 8080, fn){
    message('error', 'Please do not use this in production.');
    if (!runningInstances.includes(PORT)) {
      this.server.listen(PORT, fn(null, this.server, PORT));
      runningInstances.push(this.server.address().port);
    } else {
      console.log('Server is already running on PORT', PORT);
      fn('Server is already running', null, null);
    }
  }

  /**
   * Close the server and it wont accept
   * any connection requests.
   * @memberOf Server
   */
  close() {
    this.server.close();
  }
}

module.exports = Server;