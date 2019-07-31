const http = require('http');
const screenshot = require('screenshot-desktop');
const Jimp = require('jimp');
const robot = require('robotjs');
const url = require('url');
const fs = require('fs');

function getScreen(query, response) {
    screenshot({format:'png'}).then((originalBuffer)=>{
        Jimp.read(originalBuffer).then((imageObj)=>{
            imageObj.scale(parseFloat(query.scale) || 0.5).quality(parseInt(query.quality) || 60)
              .getBufferAsync(Jimp.MIME_PNG).then((resultingBuffer) => {
                  response.writeHead(200, { 'content-type' : 'image/png' });
                  response.end(resultingBuffer);
            });
        });
    });
}

function input(query, response) {
    if(query.type == 'click') {
        const screenSize = robot.getScreenSize();
        robot.moveMouse(query.x * screenSize.width, query.y * screenSize.height);
        robot.mouseClick();
    }
    response.end('ok');
}

http.createServer((request, response)=>{
    let parsedUrl = url.parse(request.url, true);
    console.log(parsedUrl.pathname);
    if(parsedUrl.pathname == '/' || parsedUrl.pathname == '/index.html') {
        response.end(fs.readFileSync('./index.html'));
    } else if(parsedUrl.pathname == '/getScreen') {
        getScreen(parsedUrl.query, response);
    } else if(parsedUrl.pathname == '/input') {
        input(parsedUrl.query, response);
    } else {
        response.writeHead(404);
        response.end('not found');
    }
}).listen(8080);