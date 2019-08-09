
var CropTool = (() => {
  var canvas;
  var context;
  var userSelectedRect;
  var isMouseDown;
  var screenCapture;
  var isClosed;
  var userCallback;

  function open(inputRect, screenshotUrl,  callback) {
    userSelectedRect = { left: 0, top: 0, width: 0, height: 0 };
    isMouseDown = false;
    isClosed = false;
    userCallback = callback || (() => {});
    screenCapture = new Image();
    screenCapture.src = screenshotUrl;
    canvas = document.createElement('canvas');
    canvas.width = inputRect.width;
    canvas.height = inputRect.height;
    context = canvas.getContext('2d');
    $(canvas).css('width', `${inputRect.width}px`);
    $(canvas).css('height', `${inputRect.height}px`);
    $(canvas).css('position', 'absolute');
    $(canvas).css('left', `${inputRect.left}px`);
    $(canvas).css('top', `${inputRect.top}px`);
    $(canvas).css('border', '1px solid black');
    $(canvas).css('background-image', `url(${screenshotUrl}`);
    $(canvas).css('background-size', `${canvas.width}px ${canvas.height}px`);
    $(document.body).append(canvas);
    $(canvas).mousedown(mouseEvent);
    $(canvas).mousemove(mouseEvent);
    $(canvas).mouseup(mouseEvent);
    draw();
  }

  function close() {
    isClosed = true;
    $(canvas).remove();
    canvas = null;
    context = null;
  }

  function mouseEvent(e) {

    const offset = e.currentTarget.getBoundingClientRect();
    const left = e.pageX - offset.left;
    const top = e.pageY - offset.top;

    if (e.type == 'mousemove') {
      if (isMouseDown) {
        userSelectedRect.width = left - userSelectedRect.left;
        userSelectedRect.height = top - userSelectedRect.top;
      }
    }
    else if (e.type == 'mousedown') {
      isMouseDown = true;
      userSelectedRect.left = left;
      userSelectedRect.top = top;
      userSelectedRect.width = 0;
      userSelectedRect.height = 0;
    }
    else if (e.type == 'mouseup') {
      isMouseDown = false;
      close();
      userCallback(userSelectedRect);
    }
  }

  function draw() {
    if (isClosed) {
      return;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.fillStyle = 'black';
    context.globalAlpha = 0.5;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = 1;
    context.strokeStyle = 'white';
    context.beginPath();
    context.rect(userSelectedRect.left,
                 userSelectedRect.top,
                 userSelectedRect.width,
                 userSelectedRect.height);
    context.setLineDash([10, 10]);
    context.stroke();
    context.closePath();
    context.clip();
    context.drawImage(screenCapture, 0, 0, canvas.width, canvas.height);
    context.restore();
    window.requestAnimationFrame(draw);
  }

  return { open: open, close : close };
})();