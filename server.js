const http = require('http');
const screenshot = require('screenshot-desktop');
const Jimp = require('jimp');
const robot = require('robotjs');
const url = require('url');
const fs = require('fs');

var fileExtRegExp = RegExp(".([a-zA-Z0-9])+$");
var staticFilePathsRegExp = new RegExp("^([A-Za-z0-9/]+)((.)([A-Za-z0-9]+))+$");
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

function getMimeType(filename) {
  let ext = fileExtRegExp.exec(filename)[0];
  if (ext === ".css") {
    return "text/css";
  }
  if (ext === ".js") {
    return "text/javascript";
  }
  if (ext === ".png") {
    return "image/png";
  }
  return "text/html";
}

http.createServer((request, response) => {
  let _url = url.parse(request.url, true);
  let callback = routeControllers[_url.pathname] || (() => {

    let isSafePath = staticFilePathsRegExp.test(_url.pathname);
    let finalPath = `./web_application${_url.pathname}`;
    let fileExists = fs.existsSync(finalPath);
    let mimeType = getMimeType(_url.pathname);

    if (isSafePath && fileExists) {
      response.writeHead(200, { 'content-type': mimeType });
      response.end(fs.readFileSync(finalPath));
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
  });
  callback(_url.query, response);
}).listen(8080);
