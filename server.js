const http = require('http');
const screenshot = require('screenshot-desktop');
const Jimp = require('jimp');
const robot = require('robotjs');
const url = require('url');
const fs = require('fs');

var routeControllers = [];
var onRoute = (path, callback) => routeControllers[path] = callback;

onRoute('/screen', (query, response) => {
  screenshot({ format: 'png' })
  .then((originalBuffer) => {
    Jimp.read(originalBuffer)
    .then((imageObj) => {
      imageObj
      .scale(parseFloat(query.scale) || 0.5)
      .quality(parseInt(query.quality) || 60)
      .getBufferAsync(Jimp.MIME_PNG).then((resultingBuffer) => {
        response.writeHead(200, { 'content-type': 'image/png' });
        response.end(resultingBuffer);
      });
    });
  });
});

onRoute('/input', (query, response) => {
  if (query.type == 'click') {
    const screenSize = robot.getScreenSize();
    const x = query.x * screenSize.width;
    const y = query.y * screenSize.height;
    robot.moveMouse(x, y);
    robot.mouseClick();
  }
  response.end('ok');
});

onRoute('/', (query, response) => {
  response.writeHead(200, { 'content-type': 'text/html' });
  response.end(fs.readFileSync('./client.html'));
});

onRoute('/client.js', (query, response) => {
  response.writeHead(200, { 'content-type': 'text/javascript' });
  response.end(fs.readFileSync('./client.js'));
});

onRoute('/client.css', (query, response) => {
  response.writeHead(200, { 'content-type': 'text/css' });
  response.end(fs.readFileSync('./client.css'));
});

http.createServer((request, response) => {
  let _url = url.parse(request.url, true);
  let callback = routeControllers[_url.pathname] || (()=>{
    response.writeHead(404);
    response.end('Not found');
  });
  callback(_url.query, response);
}).listen(8080);
