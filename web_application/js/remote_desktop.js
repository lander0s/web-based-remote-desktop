
var RemoteDesktop = (function () {

  const topBarHeight = 0;
  var screenImg = null;
  var canvas = null;
  var imageScale = "1.0";
  var containerSize = { width: 0, height: 0 };
  var canvasSize = { width: 0, height: 0 };

  function init() {
    screenImg = new Image();
    canvas = document.createElement('canvas');
    $('body').prepend(canvas);
    $(window).resize(resize);
    $(canvas).click(click);
    updateImage();
  }

  function resize() {
    containerSize.height = window.innerHeight - topBarHeight;
    containerSize.width = window.innerWidth;
    let ratio = screenImg.height / screenImg.width;
    canvasSize.width = containerSize.width;
    canvasSize.height = containerSize.width * ratio;
    if (canvasSize.height > containerSize.height) {
      canvasSize.height = containerSize.height;
      canvasSize.width = containerSize.height / ratio;
    }
    updateCanvasStyle();
  }

  function click(e) {
    var elm = $(this);
    var x = (e.pageX - elm.offset().left) / canvasSize.width;
    var y = (e.pageY - elm.offset().top) / canvasSize.height;
    $.get( `/input?type=click&x=${x}&y=${y}`, function( _ ) {});
  }

  function setImageScale(value) {
    imageScale = value;
  }

  function updateCanvasStyle() {
    canvas.style.position = 'absolute';
    canvas.style.backgroundColor = 'pink';
    canvas.style.width = `${canvasSize.width}px`;
    canvas.style.height = `${canvasSize.height}px`;
    canvas.style.left = "50%";
    canvas.style.top = `${(topBarHeight + (containerSize.height / 2) - (canvasSize.height / 2))}px`;
    canvas.style.marginLeft = `${-canvasSize.width / 2}px`;
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
