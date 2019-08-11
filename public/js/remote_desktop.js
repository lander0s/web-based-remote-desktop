
var RemoteDesktop = (() => {

  var screenImg = null;
  var canvas = null;
  var imageScale = "1.0";
  var canvasSize = { width: 0, height: 0 };

  function init() {
    screenImg = new Image();
    canvas = document.createElement('canvas');
    $('body').prepend(canvas);
    updateImage();
    addEventListeners();
  }

  function addEventListeners() {
    $(window).resize(resize);
    $(canvas).mousedown(mouseEvent);
    $(canvas).mouseup(mouseEvent);
    $(canvas).mousemove(mouseEvent);

    EventBus.on('crop-button-clicked', () => {
      CropTool.open(canvas.getBoundingClientRect(), canvas.toDataURL());
    });
    EventBus.on('crop-area-selected', (rect) => {
      console.log(`User selected the following area: ${JSON.stringify(rect)}`);
    });
    EventBus.on('info-button-clicked', ()=> {
      showSystemInfo();
    });
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

  function showSystemInfo() {
    $.get( '/info', function( data ) {
      $('#generic-modal-long-title').html('System information');
      $('#generic-modal-body').html(`<b>Computer name: </b>${data.computerName}<br/><b>User name: </b>${data.userName}<br/><b>OS version: </b>${data.osVersion}`);
      $('#generic-modal').modal();
    });
  }

  function mouseEvent(e) {
    const offset = $(this).offset();
    const x = (e.pageX - offset.left) / canvasSize.width;
    const y = (e.pageY - offset.top) / canvasSize.height;
    const type = e.type.substring(5);
    const button = e.originalEvent.which == 1 ? 'left' : 'right';
    $.get( `/mouse?type=${type}&x=${x}&y=${y}&button=${button}`, function( _ ) {});
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
