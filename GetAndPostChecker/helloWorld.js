var http = require('http');

http.createServer(function(req,res){
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello world!');
}).listen(3050);

console.log('Server started on localhost:3050; press Ctrl-C to terminate....');


