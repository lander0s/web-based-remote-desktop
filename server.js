const { createCanvas, ImageData } = require('canvas');
const { osversion, bgra2rgba } = require('./misc');
const express = require('express')
const robot = require('robotjs');
const expressws = require('express-ws');
const os = require('os');

const server     = express();
const screenSize = robot.getScreenSize();
const canvas     = createCanvas(screenSize.width, screenSize.height);
const scaled     = createCanvas(screenSize.width, screenSize.height);

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
  const scale = req.query.scale || 1.0;
  const left = req.query.left || 0;
  const top = req.query.top || 0;
  const width = req.query.width || screenSize.width;
  const height = req.query.height || screenSize.height;
  const capture = robot.screen.capture(left|0, top|0, ((width / 16)|0)*16, height|0);
  let rawdata = new Uint8ClampedArray(capture.image);
  bgra2rgba(rawdata, capture.width, capture.height);
  imageData = new ImageData(rawdata, capture.width, capture.height);
  canvas.width = capture.width;
  canvas.height = capture.height;
  scaled.width = canvas.width * scale;
  scaled.height = canvas.height * scale;
  canvas.getContext('2d').putImageData(imageData, 0, 0);
  scaled.getContext('2d').drawImage(canvas, 0, 0, scaled.width, scaled.height);
  scaled.createPNGStream().pipe(res);
});

server.ws('/input', function(ws, req) {
  ws.on('message', function(msg) {
    try {
      const event = JSON.parse(msg);
      if(event.type == 'mouseup' || event.type == 'mousedown') {
        const upOrDown = event.type.substring(5);
        robot.moveMouse( event.x , event.y );
        robot.mouseToggle(upOrDown, event.button);
      } else if(event.type == 'mousemove') {
        robot.moveMouse( event.x , event.y );
      } else if(event.type == 'keyup' || event.type == 'keydown') {
        const upOrDown = event.type.substring(3);
        robot.keyToggle(event.key, upOrDown, event.modifiers);
      }
    } catch(e) { }
  });
});


