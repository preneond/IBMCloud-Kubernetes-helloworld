var http = require('http');

var handleRequest = (request,response) => {
  console.log('Received request for URL: ' + request.url);
  response.writeHead(200);
  response.end('Hello World!');
};

console.log('Listening on port 8080...')
var server = http.createServer(handleRequest);
server.listen(8080);
