var PageInit = function() {
  this.init();
}
PageInit.prototype = {
  init: function() {
    $(window).off();
    $(document).off();
    new MainSlider();
    new Overlay();
    new Pages();
    new Contacts();
    new Input();
    $(window).on('load', function(){
      $('.js-customScroll').mCustomScrollbar({
        theme:"rounded",
        scrollInertia: 100,
      });
    });
  }
}
var Init = function() {
  new PageInit();
}
$(Init);