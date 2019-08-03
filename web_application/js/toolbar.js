const Toolbar = (() => {

  var eventCallbacks = [];

  function init() {

    eventCallbacks["scaleChanged"] = () => { };
    eventCallbacks["keyCombination"] = () => { };

    $('.resolution-option').click( (e) => {
      $('#resolution-button').html(`Quality: ${$(e.target).html()}`);
      eventCallbacks["scaleChanged"](e.target.dataset.scale);
    });

    $('.key-combination-option').click( (e)=> {
      eventCallbacks["keyCombination"](e.target.innerHTML);
    });

    $('.topbar').mouseenter(()=>{
      $('.topbar').css('top', '0px');
    });

    $('.topbar').mouseleave(()=>{
      $('.topbar').css('top','-60px');
    });
  }

  function on(event, callback) {
    eventCallbacks[event] = callback;
  }

  return { init: init, on: on };
})();