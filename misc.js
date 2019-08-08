const os = require('os');

function bgra2rgba(rawdata, width, height) {
  const pixels = width * height;
  for (let i = 0; i < pixels; i++) {
    let index = i * 4;
    let blue = rawdata[index + 0];
    rawdata[index + 0] = rawdata[index + 2];
    rawdata[index + 2] = blue;
  }
}

function osversion() {
  if (os.platform() == 'win32') {
    return `Microsoft Windows ${os.release()}`;
  }
  if (os.platform() == 'linux') {
    return `GNU/Linux ${os.release()}`;
  }
  if (os.platform() == 'darwin') {
    return `MacOS ${os.release()}`;
  }
  return 'Unkown';
}

module.exports = {
  osversion: osversion,
  bgra2rgba: bgra2rgba
};