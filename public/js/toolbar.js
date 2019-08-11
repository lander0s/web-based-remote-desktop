const Toolbar = (() => {

  function init() {

    $('.resolution-option').click( (e) => {
      $('#resolution-button').html(`Quality: ${$(e.target).html()}`);
      EventBus.trigger('scale-button-clicked', e.target.dataset.scale);
    });

    $('.key-combination-option').click( (e)=> {
      EventBus.trigger('key-combination-button-clicked', e.target.innerHTML);
    });

    $('#crop-button').click(()=>{
      EventBus.trigger('crop-button-clicked');
    });

    $('#info-button').click(() => {
      EventBus.trigger('info-button-clicked');
    });

    $('.topbar').mouseenter(()=>{
      $('.topbar').css('top', '0px');
    });

    $('.topbar').mouseleave(()=>{
      $('.topbar').css('top','-60px');
    });
  }

  return { init: init };
})();