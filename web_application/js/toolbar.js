const Toolbar = (() => {

  var eventCallbacks = [];

  function init() {

    eventCallbacks["scaleChanged"] = [];
    eventCallbacks["keyCombination"] = [];

    var resolutionButton = document.querySelector('#resolution-button');
    var resOptionElements = document.querySelectorAll('.resolution-option');
    var keyCombinationElements = document.querySelectorAll('.key-combination-option');
    resOptionElements.forEach((elem) => {
      elem.addEventListener('click', (e) => {
        resolutionButton.innerHTML = `Quality: ${e.target.innerHTML}`;
        eventCallbacks["scaleChanged"].forEach((callback) => {
          callback(e.target.dataset.scale);
        });
      });
    });
    keyCombinationElements.forEach((elem) => {
      elem.addEventListener('click', (e) => {
        eventCallbacks["keyCombination"].forEach((callback) => {
          callback(e.target.innerHTML);
        });
      });
    });
  }

  function on(event, callback) {
    eventCallbacks[event].push(callback);
  }

  return { init: init, on: on };
})();