

const Application = (() => {
  function init() {
    Loading.show();
    Toolbar.init();
    RemoteDesktop.init();
  }
  return { init: init };
})();