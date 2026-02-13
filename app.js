const http = require('http');

console.log("Starting server...");

const server = http.createServer((req, res) => {
  res.end("Version 1 - Running in Kubernetes");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});

