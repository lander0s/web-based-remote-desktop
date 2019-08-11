

const Application = (() => {
  function init() {
    Toolbar.init();
    RemoteDesktop.init();
  }
  return { init: init };
})();