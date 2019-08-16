
const RemoteDesktop = (() => {

  var screenImg = null;
  var canvas = null;
  var socket = null;
  var imageScale = "0.5";
  var canvasSize = { width: 0, height: 0 };
  var screenSize = { width: 0, height: 0 };
  var cropArea = { left: 0, top: 0, width: 0, height: 0 };
  var isFirstFrame = true;

  function init() {
    socket = new WebSocket(`${getWebSocketBaseUrl()}/input`);
    screenImg = new Image();
    canvas = document.createElement('canvas');
    $('body').prepend(canvas);
    $.get( '/info', function( data ) {
      screenSize = data.screenSize;
      cropArea.width = screenSize.width;
      cropArea.height = screenSize.height;
      updateImage();
    });
    addEventListeners();
  }

  function addEventListeners() {
    $(window).resize(resize);
    $(canvas).mousedown(mouseEvent);
    $(canvas).mouseup(mouseEvent);
    $(canvas).mousemove(mouseEvent);
    $(window).keydown(keyboardEvent);
    $(window).keyup(keyboardEvent);

    socket.addEventListener('open', ()=>{
      console.log('control connection established');
    });

    socket.addEventListener('message', ()=>{
      console.log('server message received');
    });

    EventBus.on('crop-button-clicked', () => {
      if(CropTool.isOpen() || isCropped()) {
        CropTool.cancel();
        restoreFullImage();
      } else {
        CropTool.open(canvas.getBoundingClientRect(), canvas.toDataURL());
      }
    });

    EventBus.on('crop-area-selected', (rect) => {
      cropArea.left = (rect.left / canvasSize.width) * screenSize.width;
      cropArea.top = (rect.top / canvasSize.height) * screenSize.height;
      cropArea.width = (rect.width / canvasSize.width) * screenSize.width;
      cropArea.height = (rect.height / canvasSize.height) * screenSize.height;
    });

    EventBus.on('info-button-clicked', ()=> {
      showSystemInfo();
    });

    EventBus.on('scale-button-clicked', (scale)=> {
      imageScale = scale;
    });
  }

  function showSystemInfo() {
    $.get( '/info', function( data ) {
      $('#generic-modal-long-title').html('System information');
      $('#generic-modal-body').html(`<b>Computer name: </b>${data.computerName}<br/><b>User name: </b>${data.userName}<br/><b>OS version: </b>${data.osVersion}`);
      $('#generic-modal').modal();
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

  function mouseEvent(e) {
    const offset = $(this).offset();
    const xInPixels = (((e.pageX - offset.left) / canvasSize.width) * cropArea.width) + cropArea.left;
    const yInPixels = (((e.pageY - offset.top) / canvasSize.height) * cropArea.height) + cropArea.top;
    socket.send(JSON.stringify({
      type : e.type,
      button : e.originalEvent.which == 1 ? 'left' : 'right',
      x : xInPixels,
      y : yInPixels,
    }));
  }

  function keyboardEvent(e) {
    e.originalEvent.preventDefault();
    socket.send(JSON.stringify({
      type : e.type,
      key : key2Robot(e.originalEvent.key),
      modifiers : getKeyModifiers(e),
    }));
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
    const url = `./screen?scale=${imageScale}&left=${cropArea.left}&top=${cropArea.top}&width=${cropArea.width}&height=${cropArea.height}&time=${new Date().getTime()}`;
    screenImg.src = url;
    screenImg.onload = () => {
      canvas.width = screenImg.width;
      canvas.height = screenImg.height;
      resize();
      let ctx = canvas.getContext('2d');
      ctx.drawImage(screenImg, 0, 0, canvas.width, canvas.height);
      if(isFirstFrame) {
        EventBus.trigger('first-frame-loaded');
        isFirstFrame = false;
      }
      updateImage();
    };
  }

  function isCropped() {
    return cropArea.width != screenSize.width
      ||  cropArea.height != screenSize.height;
  }

  function restoreFullImage() {
    cropArea.left = 0;
    cropArea.top = 0;
    cropArea.width = screenSize.width;
    cropArea.height = screenSize.height;
  }

  function getWebSocketBaseUrl() {
    const loc = window.location;
    let baseUrl;
    if (loc.protocol === "https:") {
        baseUrl = "wss:";
    } else {
        baseUrl = "ws:";
    }
    baseUrl += "//" + loc.host;
    return baseUrl;
  }

  function key2Robot(key) {
    return key
    .toLowerCase()
    .replace('arrow','');
  }

  function getKeyModifiers(keyEvent) {
    let modifiers = [];
    if(keyEvent.originalEvent.altKey) {
      modifiers.push('alt');
    }
    if(keyEvent.originalEvent.ctrlKey) {
      modifiers.push('ctrl');
    }
    if(keyEvent.originalEvent.shiftKey) {
      modifiers.push('shift');
    }
    if(keyEvent.originalEvent.metaKey) {
      modifiers.push('command');
    }
    return modifiers;
  }

  return {
    init: init,
  };
})();
