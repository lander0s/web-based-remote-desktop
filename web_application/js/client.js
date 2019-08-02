
Toolbar.init();

var RemoteDesktop = (function () {
  var image = null;
  var canvas = null;
  function init() {
    canvas = document.querySelector('#screen');
    canvas.addEventListener('click', (e) => {
      let rect = e.target.getBoundingClientRect();
      let x = (e.clientX - rect.left) / rect.width;
      let y = (e.clientY - rect.top) / rect.height;
      document.body.style.backgroundImage = `url("/input?type=click&x=${x}&y=${y}#${new Date().getTime()}")`;
    });
    image = new Image();
    updateImage();
  }

  function updateImage() {
    image.src = './screen?scale=0.25&time=' + new Date().getTime();
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.style.width = image.width + 'px';
      canvas.style.height = image.height + 'px';
      canvas.style.marginLeft = (-image.width / 2) + 'px';
      canvas.style.marginTop = (-image.height / 2) + 'px';
      canvas.getContext('2d').drawImage(image, 0, 0);
      setTimeout(updateImage, 100);
    }
  }

  return { init: init }
})();
