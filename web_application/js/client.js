
const fakeImage = {
  width: 1280,
  height: 720,
}

var RemoteDesktop = (function () {
  const topBarHeight = 60;
  var screenImg = null;
  var canvas = null;
  var containerSize = {
    width: 0,
    height: 0
  };
  var canvasSize = {
    width: 0,
    height: 0    
  }

  function init() {
    Toolbar.init();
    screenImg = new Image();
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    updateImage();
    window.addEventListener('resize', resize);
  }

  function resize() {
    containerSize.height = window.innerHeight - topBarHeight;
    containerSize.width = window.innerWidth;
    let ratio = fakeImage.height / fakeImage.width;
    canvasSize.width = containerSize.width;
    canvasSize.height = containerSize.width * ratio;
    if(canvasSize.height > containerSize.height) {
      canvasSize.height = containerSize.height;
      canvasSize.width = containerSize.height / ratio;
    }
    updateCanvasStyle();
  }

  function updateCanvasStyle() {
    canvas.style.position = 'absolute';
    canvas.style.zIndex = "-10";
    canvas.style.backgroundColor = 'pink';
    canvas.style.width = `${canvasSize.width}px`;
    canvas.style.height = `${canvasSize.height}px`;
    canvas.style.left = "50%";
    canvas.style.top = `${(topBarHeight + (containerSize.height/2) - (canvasSize.height/2))}px`;
    canvas.style.marginLeft = `${-canvasSize.width/2}px`;
  }

  function updateImage() {
    // on image loaded
    canvas.width = fakeImage.width;
    canvas.width = fakeImage.height;
    resize();
  }

  return { init: init }
})();

RemoteDesktop.init();