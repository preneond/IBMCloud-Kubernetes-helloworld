var http = require('http');

var handleRequest = (request,response) => {
  console.log('Received request for URL: ' + request.url);
  response.writeHead(200);
  response.end('Hello World!');
};

var server = http.createServer(handleRequest);
server.listen(8080);
