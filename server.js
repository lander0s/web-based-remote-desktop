const { createCanvas, ImageData } = require('canvas');
const { osversion, bgra2rgba } = require('./misc');
const express = require('express')
const robot = require('robotjs');
const os = require('os');

const server     = express();
const screenSize = robot.getScreenSize();
const canvas     = createCanvas(screenSize.width, screenSize.height);

server.get('/info', (req, res) => {
  res.send({
    computerName : os.hostname(),
    userName     : os.userInfo().username,
    osVersion    : osversion(),
  });
});

server.get('/mouse', (req, res) => {
  const x = req.query.x || 0;
  const y = req.query.y || 0;
  const type = req.query.type || 'down';
  const button = req.query.button || 'right';
  robot.moveMouse( x * screenSize.width, y * screenSize.height);
  if (type == 'down' || type == 'up') {
    robot.mouseToggle(type, button);
  }
  res.send({result:'success'});
});

server.get('/screen', (req, res) => {
  let left = req.query.left || 0.0;
  let top = req.query.top || 0.0;
  let width = req.query.width || 1.0;
  let height = req.query.height || 1.0;

  left = (left * screenSize.width)|0;
  top = (top * screenSize.height)|0;
  width = (width * screenSize.width)|0;
  height = (height * screenSize.height)|0;
  let capture = robot.screen.capture(left, top, width, height);
  let rawdata = new Uint8ClampedArray(capture.image);
  bgra2rgba(rawdata, capture.width, capture.height);
  imageData = new ImageData(rawdata, capture.width, capture.height);
  canvas.width = capture.width;
  canvas.height = capture.height;
  let context = canvas.getContext('2d');
  context.putImageData(imageData, 0, 0);
  canvas.createPNGStream().pipe(res);
});

server.use(express.static('public'));
server.listen(8080, () => {
  console.log('Server listening on http://127.0.0.1:8080');
});
