
const CropTool = (() => {
  var canvas;
  var context;
  var selectedRect;
  var isMouseDown;
  var screenCapture;
  var isClosed = true;

  function open(inputRect, screenshotUrl) {
    selectedRect = { left: 0, top: 0, width: 0, height: 0 };
    isMouseDown = false;
    isClosed = false;
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
    addEventListeners();
    draw();
    EventBus.trigger('crop-tool-state-changed', 'open');
  }

  function cancel() {
    close();
    EventBus.trigger('crop-tool-state-changed', 'canceled');
  }

  function addEventListeners() {
    $(canvas).mousedown(mouseEvent);
    $(canvas).mousemove(mouseEvent);
    $(canvas).mouseup(mouseEvent);
    $(window).keyup(keyup);
  }

  function close() {
    isClosed = true;
    if(canvas != null) {
      $(canvas).remove();
    }
    canvas = null;
    context = null;
  }

  function mouseEvent(e) {

    const offset = e.currentTarget.getBoundingClientRect();
    const left = e.pageX - offset.left;
    const top = e.pageY - offset.top;

    if (e.type == 'mousemove') {
      if (isMouseDown) {
        selectedRect.width = left - selectedRect.left;
        selectedRect.height = top - selectedRect.top;
      }
    }
    else if (e.type == 'mousedown') {
      isMouseDown = true;
      selectedRect.left = left;
      selectedRect.top = top;
      selectedRect.width = 0;
      selectedRect.height = 0;
    }
    else if (e.type == 'mouseup') {
      isMouseDown = false;
      close();
      EventBus.trigger('crop-area-selected', selectedRect);
    }
  }

  function keyup(e) {
    if(!isClosed) {
      if(e.originalEvent.code === 'Escape') {
        EventBus.trigger('crop-tool-state-changed', 'canceled');
        close();
      }
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
    context.rect(selectedRect.left,
                 selectedRect.top,
                 selectedRect.width,
                 selectedRect.height);
    context.setLineDash([10, 10]);
    context.stroke();
    context.closePath();
    context.clip();
    context.drawImage(screenCapture, 0, 0, canvas.width, canvas.height);
    context.restore();
    window.requestAnimationFrame(draw);
  }

  function isOpen() {
    return !isClosed;
  }

  return { open: open, cancel : cancel, isOpen : isOpen };
})();