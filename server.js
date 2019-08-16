
const { createCanvas, ImageData } = require('canvas');
const express = require('express')
const robot = require('robotjs');
const expressws = require('express-ws');
const misc = require('./misc');
const os = require('os');
const SERVER_PORT = 8080;

const RemoteDesktopServer = (() => {

  const screenSize = robot.getScreenSize();
  const server = express();
  const canvas = createCanvas(screenSize.width, screenSize.height);
  const scaledCanvas = createCanvas(screenSize.width, screenSize.height);

  function init() {
    expressws(server);
    server.use(express.static('public'));
    listener = server.listen(SERVER_PORT, () => {
      console.log('Server listening on: ');
      console.log(` - http://${os.hostname().replace('.local', '')}:${SERVER_PORT}`);
    });
    setupService();
  }

  function setupService() {
    /* sanitize /screen params */
    server.use('/screen', (req, res, next) => {
      req.query.scale = parseFloat(req.query.scale) || 1.0;
      req.query.left = parseInt(req.query.left) || 0;
      req.query.top = parseInt(req.query.top) || 0;
      req.query.width = parseInt(req.query.width) || screenSize.width;
      req.query.height = parseInt(req.query.height) || screenSize.height;
      req.query.width -= req.query.width % 16;
      next();
    });

    /* setup /screen controller */
    server.get('/screen', (req, res) => {
      const capture = robot.screen.capture(
        req.query.left,
        req.query.top,
        req.query.width,
        req.query.height
      );

      let rawdata = new Uint8ClampedArray(capture.image);
      misc.bgra2rgba(
        rawdata,
        capture.width,
        capture.height
      );

      imageData = new ImageData(
        rawdata,
        capture.width,
        capture.height
      );

      canvas.width = capture.width;
      canvas.height = capture.height;
      scaledCanvas.width = canvas.width * req.query.scale;
      scaledCanvas.height = canvas.height * req.query.scale;

      canvas.getContext('2d').putImageData(imageData, 0, 0);
      scaledCanvas.getContext('2d').drawImage(
        canvas,
        0,
        0,
        scaledCanvas.width,
        scaledCanvas.height
      );

      scaledCanvas.createPNGStream().pipe(res);
    });

    /* setup /info controller */
    server.get('/info', (req, res) => {
      res.send({
        computerName: os.hostname().replace('.local', ''),
        userName: os.userInfo().username,
        osVersion: misc.osversion(),
        screenSize: screenSize,
      });
    });

    /* setup /input controller using websockets */
    server.ws('/input', (ws, req) => {
      ws.on('message', (msg) => {
        let event = JSON.parse(msg);
        if (event.type == 'mouseup'
          || event.type == 'mousedown') {
          let upOrDown = event.type.substring(5);
          robot.moveMouse(event.x, event.y);
          robot.mouseToggle(upOrDown, event.button);
        } else if (event.type == 'mousemove') {
          robot.moveMouse(event.x, event.y);
        } else if (event.type == 'keyup'
          || event.type == 'keydown') {
          let upOrDown = event.type.substring(3);
          robot.keyToggle(event.key, upOrDown, event.modifiers);
        }
      });
    });
  }

  return { init: init };
})();

RemoteDesktopServer.init();
