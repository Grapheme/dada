var Overlay = function() {
  this.init();
}
Overlay.prototype = {
  settings: {
    transitionDuration: 300
  },
  dom: {
    overlay: $('.js-overlay'),
    popups: $('.js-popup'),
  },
  close: function(name) {
    var t = this;
    var overlay = t.dom.overlay;
    var popup = t.dom.popups.filter('[data-name="' + name + '"]');
    var all = overlay.add(popup);
    all.removeClass('active');
    $('html').removeClass('locked');
    setTimeout(function(){
      all.hide();
    }, t.settings.transitionDuration);
  },
  show: function(name) {
    var t = this;
    var overlay = t.dom.overlay;
    var popup = t.dom.popups.filter('[data-name="' + name + '"]');
    var all = overlay.add(popup);
    all.show();
    $('html').addClass('locked');
    setTimeout(function(){
      all.addClass('active');
    }, 1);
  },
  init: function() {
    var t = this;
    $('.js-show-popup').on('click', function(){
      t.show($(this).attr('data-popup'));
      console.log($('[data-name]'));
      return false;
    });
    $('.js-close-popup').on('click', function(){
      t.close($(this).parents('[data-name]').attr('data-name'));
      return false;
    });
    $('.js-popup').on('click', function(e){
      if($(e.target).hasClass('js-popup')) {
        t.close($(this).attr('data-name'));
      }
      return false;
    });
  }
}