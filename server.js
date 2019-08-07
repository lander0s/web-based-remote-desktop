const express = require('express')
const screenshot = require('screenshot-desktop');
const Jimp = require('jimp');
const robot = require('robotjs');
const os = require('os');
const server = express();

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

server.get('/screen', (req , res )=>{
  screenshot({ format: 'png' })
    .then((originalBuffer) => {
      Jimp.read(originalBuffer)
        .then((imageObj) => {
          imageObj
            .scale(parseFloat(req.query.scale) || 0.5)
            .quality(parseInt(req.query.quality) || 01)
            .getBufferAsync(Jimp.MIME_PNG).then((resultingBuffer) => {
              res.writeHead(200, { 'content-type': 'image/png' });
              res.end(resultingBuffer);
            });
        });
    });
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