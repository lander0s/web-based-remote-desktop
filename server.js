const screenshot = require('screenshot-desktop');
const http = require('http');
const Jimp = require('jimp');

http.createServer((request, response)=>{
    screenshot({format:'png'}).then((originalBuffer)=>{
        Jimp.read(originalBuffer).then((imageObj)=>{
            imageObj.scale(0.5).quality(60)
              .getBufferAsync(Jimp.MIME_PNG).then((resultingBuffer) => {
                response.writeHead(200, {'content-type' : 'image/png'});
                response.end(resultingBuffer);
            });
        });
    });
}).listen(8080);