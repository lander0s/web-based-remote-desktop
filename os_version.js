const os = require('os');

function osversion() {
  if (os.platform() === 'win32') {
    return `Microsoft Windows ${os.release()}`;
  }
  if (os.platform() === 'linux') {
    return `GNU/Linux ${os.release()}`;
  }
  if (os.platform() === 'darwin') {
    return `MacOS ${os.release()}`;
  }
  return `${os.platform()} - ${os.release()}`;
}

module.exports = osversion;