const Toolbar = (() => {

  var Events = Object.freeze({ "resolutionChanged": 0, "enterFullscreen": 1, "sendKeyCombination": 2 });
  var eventCallbacks = [[], [], []];

  function init() {
    var resolutionButton = document.querySelector('#resolution-button');
    var resOptionElements = document.querySelectorAll('.resolution-option');
    var keyCombinationElements = document.querySelectorAll('.key-combination-option');
    resOptionElements.forEach((elem) => {
      elem.addEventListener('click', (e) => {
        resolutionButton.innerHTML = `Quality: ${e.target.innerHTML}`;
        eventCallbacks[Events.resolutionChanged].forEach((callback) => {
          callback(e.target.dataset.scale);
        });
      });
    });
    keyCombinationElements.forEach((elem) => {
      elem.addEventListener('click', (e) => {
        eventCallbacks[Events.sendKeyCombination].forEach((callback) => {
          callback(e.target.innerHTML);
        });
      });
    });
  }

  function on(event, callback) {
    eventCallbacks[event].push(callback);
  }

  return { init: init, on: on, Events : Events };
})();