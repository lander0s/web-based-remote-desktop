
const Loading = (() => {
  var div = null;
  var minTimeMs = 1500;
  var showTimeStamp = 0;

  function show() {
    showTimeStamp = new Date().getTime();
    div = document.createElement('div');
    $(div).css('position','absolute');
    $(div).css('left','0');
    $(div).css('top','0');
    $(div).css('width','100%');
    $(div).css('height','100%');
    $(div).css('background-color','#34495e');
    $(div).css('background-image',`url(../img/loading.svg)`);
    $(div).css('background-repeat','no-repeat');
    $(div).css('background-size','10%');
    $(div).css('background-position','center');
    $(div).css('transition','all 0.2s linear');
    $(document.body).append(div);
    EventBus.on('first-frame-loaded', ()=>{
        let elapsedTime = new Date().getTime() - showTimeStamp;
        let delay = Math.max(minTimeMs - elapsedTime, 0);
        setTimeout(hide, delay);
    });
  }

  function hide() {
      $(div).css('opacity','0');
      setTimeout(()=>{
          $(div).remove();
      },300);
  }

  return {
    show : show,
  };
})();