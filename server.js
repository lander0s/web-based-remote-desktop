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
    screenSize   : screenSize,
  });
});

server.get('/mouse', (req, res) => {
  const x = req.query.x || 0;
  const y = req.query.y || 0;
  const type = req.query.type || 'down';
  const button = req.query.button || 'right';
  robot.moveMouse( x , y );
  if (type == 'down' || type == 'up') {
    robot.mouseToggle(type, button);
  }
  res.send({result:'success'});
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

server.use(express.static('public'));
server.listen(8080, () => {
  console.log('Server listening on http://127.0.0.1:8080');
});
