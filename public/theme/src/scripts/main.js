var PageInit = function() {
  this.init();
}
PageInit.prototype = {
  init: function() {
    $(window).off();
    $(document).off();
    $('.js-main-slider .js-slide').off('click', '.js-slide-left, .js-slide-right');
    new MainSlider();
    new Overlay();
    new Pages();
    new Input();
    new Contacts();
    $(window).on('load', function(){
      $('.js-customScroll').mCustomScrollbar({
        theme:"rounded",
        scrollInertia: 100,
      });
    });
    $(document).on('click', '.js-project-scroll', function(){
      $('html, body').animate({
        scrollTop: $(window).height()
      });
      return false;
    });
  }
}
var Init = function() {
  new PageInit();
}
$(Init);