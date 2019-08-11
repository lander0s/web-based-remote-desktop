

var Application = (() => {
  function init() {

    Toolbar.init();
    RemoteDesktop.init();

    EventBus.on('info-button-clicked', ()=> {
      $.get( '/info', function( data ) {
        console.log(data);
        $('#generic-modal-long-title').html('System information');
        $('#generic-modal-body').html(`<b>Computer name: </b>${data.computerName}<br/><b>User name: </b>${data.userName}<br/><b>OS version: </b>${data.osVersion}`);
        $('#generic-modal').modal();
      });
    });
  }
  return { init: init };
})();