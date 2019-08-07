const express = require('express')
const robot = require('robotjs');
const os = require('os');
const { createCanvas, ImageData } = require('canvas');

const server     = express();
const screenSize = robot.getScreenSize();
const canvas     = createCanvas(screenSize.width, screenSize.height);
const context    = canvas.getContext('2d');

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

server.get('/screen', (req, res) => {
  let capture = robot.screen.capture();
  let pixels = capture.width * capture.height;
  let uint8array = new Uint8ClampedArray(capture.image);
  for(let i = 0; i < pixels; i++) {
      let index = i * 4;
      let blue = uint8array[ index + 0];
      uint8array[ index + 0] = uint8array[ index + 2];
      uint8array[ index + 2] = blue;
  }
  imageData = new ImageData(uint8array, capture.width, capture.height);
  context.putImageData(imageData, 0,0);
  canvas.createPNGStream().pipe(res);
});

server.get('/mouse', (req, res) => {
  const screenSize = robot.getScreenSize();
  robot.moveMouse(
    req.query.x * screenSize.width,
    req.query.y * screenSize.height
  );
  if (req.query.type == 'mousedown' 
  || req.query.type == 'mouseup') {
    robot.mouseToggle(req.query.type.substring(5));
  }
  res.send({result:'success'});
});

server.get('/info', (req, res) => {
  res.send({
    computerName : os.hostname(),
    userName     : os.userInfo().username,
    osVersion    : getOsVersion(),
  });
});

server.use(express.static('public'));
server.listen(8080, () => {
  console.log('Server listening on http://127.0.0.1:8080');
});