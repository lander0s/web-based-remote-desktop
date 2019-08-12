const { createCanvas, ImageData } = require('canvas');
const { osversion, bgra2rgba } = require('./misc');
const express = require('express')
const robot = require('robotjs');
const expressws = require('express-ws');
const os = require('os');

const server     = express();
const screenSize = robot.getScreenSize();
const canvas     = createCanvas(screenSize.width, screenSize.height);

expressws(server);
server.use(express.static('public'));
server.listen(8080, () => {
  console.log('Server listening on http://127.0.0.1:8080');
});

server.get('/info', (req, res) => {
  res.send({
    computerName : os.hostname(),
    userName     : os.userInfo().username,
    osVersion    : osversion(),
    screenSize   : screenSize,
  });
});

server.get('/screen', (req, res) => {
  const left = req.query.left || 0;
  const top = req.query.top || 0;
  const width = req.query.width || screenSize.width;
  const height = req.query.height || screenSize.height;
  const capture = robot.screen.capture(left, top, width, height);
  let rawdata = new Uint8ClampedArray(capture.image);
  bgra2rgba(rawdata, capture.width, capture.height);
  imageData = new ImageData(rawdata, capture.width, capture.height);
  canvas.width = capture.width;
  canvas.height = capture.height;
  canvas.getContext('2d').putImageData(imageData, 0, 0);
  canvas.createPNGStream().pipe(res);
});

server.ws('/input', function(ws, req) {
  ws.on('message', function(msg) {
    const event = JSON.parse(msg);
    if(event.type == 'mouseup' || event.type == 'mousedown') {
      const upOrDown = event.type.substring(5);
      robot.moveMouse( event.x , event.y );
      robot.mouseToggle(upOrDown, event.button);
    } else if(event.type == 'mousemove') {
      robot.moveMouse( event.x , event.y );
    }
  });
});


