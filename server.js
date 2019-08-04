const http = require('http');
const screenshot = require('screenshot-desktop');
const Jimp = require('jimp');
const robot = require('robotjs');
const url = require('url');
const fs = require('fs');
const os = require('os');

const fileExtRegExp = RegExp(".([a-zA-Z0-9])+$");
const staticFilePathsRegExp = new RegExp("^([A-Za-z0-9/]+)((.)([A-Za-z0-9]+))+$");
var mimeTypes = {
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png'
};

var routeControllers = [];
const onRoute = (path, callback) => routeControllers[path] = callback;

onRoute('/screen', (query, response) => {
  screenshot({ format: 'png' })
    .then((originalBuffer) => {
      Jimp.read(originalBuffer)
        .then((imageObj) => {
          imageObj
            .scale(parseFloat(query.scale) || 0.5)
            .quality(parseInt(query.quality) || 01)
            .getBufferAsync(Jimp.MIME_PNG).then((resultingBuffer) => {
              response.writeHead(200, { 'content-type': 'image/png' });
              response.end(resultingBuffer);
            });
        });
    });
});

onRoute('/mouse', (query, response) => {
  const screenSize = robot.getScreenSize();
  const x = query.x * screenSize.width;
  const y = query.y * screenSize.height;
  robot.moveMouse(x, y);
  if (query.type == 'mousedown' || query.type == 'mouseup') {
    robot.mouseToggle(query.type.substring(5));
  }
  response.end('ok');
});

onRoute('/info', (query, response) => {
  response.writeHead(200, {'content-type' : 'application/json; charset=utf-8'});
  response.end(JSON.stringify({
    computerName : os.hostname(),
    userName : os.userInfo().username,
    osVersion : getOsVersion(),
  }));
});

function getMimeType(filename) {
  let ext = (fileExtRegExp.exec(filename) || [""])[0];
  return mimeTypes[ext] || "text/html";
}

function getOsVersion() {
  if(os.platform() === 'win32') {
    return `Microsoft Windows ${os.release()}`;
  }
  if(os.platform() === 'linux') {
    return `GNU/Linux ${os.release()}`;
  }
  if(os.platform() === 'darwin') {
    return `MacOS ${os.release()}`;
  }
  return `${os.platform()} - ${os.release()}`;
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