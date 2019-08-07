

var Application = (() => {
  function init() {
    Toolbar.init();
    RemoteDesktop.init();
    Toolbar.on("scaleChanged", (value) => {
      RemoteDesktop.setImageScale(value);
    });
  }
  return { init: init };
})();