
var RemoteDesktop = (() => {

  var screenImg = null;
  var canvas = null;
  var imageScale = "1.0";
  var canvasSize = { width: 0, height: 0 };

  function init() {
    screenImg = new Image();
    canvas = document.createElement('canvas');
    $('body').prepend(canvas);
    $(window).resize(resize);
    $(canvas).mousedown(mouseEvent);
    $(canvas).mouseup(mouseEvent);
    $(canvas).mousemove(mouseEvent);
    updateImage();
  }

  function resize() {
    let ratio = screenImg.height / screenImg.width;
    canvasSize.width = window.innerWidth;
    canvasSize.height = window.innerWidth * ratio;
    if (canvasSize.height > window.innerHeight) {
      canvasSize.height = window.innerHeight;
      canvasSize.width = window.innerHeight / ratio;
    }
    updateCanvasStyle();
  }

  function mouseEvent(e) {
    let offset = $(this).offset();
    let x = (e.pageX - offset.left) / canvasSize.width;
    let y = (e.pageY - offset.top) / canvasSize.height;
    $.get( `/mouse?type=${e.type}&x=${x}&y=${y}`, function( _ ) {});
  }

  function setImageScale(value) {
    imageScale = value;
  }

  function updateCanvasStyle() {
    $(canvas).css('position','absolute');
    $(canvas).css('background-color','pink');
    $(canvas).css('left','50%');
    $(canvas).css('width',`${canvasSize.width}px`);
    $(canvas).css('height',`${canvasSize.height}px`);
    $(canvas).css('top',`${(window.innerHeight / 2) - (canvasSize.height / 2)}px`);
    $(canvas).css('margin-left', `${-canvasSize.width / 2}px`);
  }

  function updateImage() {
    screenImg.src = `./screen?scale=${imageScale}&time=${new Date().getTime()}`;
    screenImg.onload = () => {
      canvas.width = screenImg.width;
      canvas.height = screenImg.height;
      resize();
      let ctx = canvas.getContext('2d');
      ctx.drawImage(screenImg, 0, 0, canvas.width, canvas.height);
      updateImage();
    };
  }

  return {
    init: init,
    setImageScale: setImageScale
  };
})();
