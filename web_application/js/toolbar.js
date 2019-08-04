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

    $('#info-button').click(() => {
      $.get( '/info', function( data ) {
        console.log(data);
        $('#generic-modal-long-title').html('System information');
        $('#generic-modal-body').html(`<b>Computer name: </b>${data.computerName}<br/><b>User name: </b>${data.userName}<br/><b>OS version: </b>${data.osVersion}`);
        $('#generic-modal').modal();
      });
    });
  }

  function on(event, callback) {
    eventCallbacks[event] = callback;
  }

  return { init: init, on: on };
})();