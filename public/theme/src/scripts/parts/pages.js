var Pages = function() {
  this.init();
}
Pages.prototype = {
  getPage: function(href, callback) {
    $.get(href)
      .done(function(responce){
        var data = {};
        $.each($(responce), function(i, v){
          if($(v).is('title')) {
            data.title = $(v).text();
            return;
          };
          if(v.className && $(v).hasClass('js-page-container')) {
            data.page = v;
            return;
          };
        });
        callback(data);
      })
      .fail(function(){
        window.location.href = href;
      });
  },
  changeUrl: function(href, data) {
    window.history.pushState({
      "pageTitle": data.title
    }, "", href);
  },
  changePage: function(href, callback) {
    var t = this;
    t.getPage(href, function(data){
      console.log(data);
      $('.js-page-changer').html(data.page);
      $('title').text(data.title);
      t.changeUrl(href, data);
      setTimeout(function(){
        new PageInit();
      }, 1);
      callback();
    });
  },
  goFromMain: function(elem) {
    var t = this;
    var parent = elem.parent();
    var pageChanger = $('.js-page-changer');
    var pageContainer = $('.js-page-container');
    $('.js-main-slider').addClass('disabled');
    parent.addClass('opened');
    setTimeout(function(){
      $('.js-index-sample').css({
        'background-image': parent.css('background-image'),
        'top': parent.offset().top,
        'left': parent.offset().left,
        'right': $(window).width() - parent.offset().left - parent.width(),
        'bottom': $(window).height() - parent.offset().top - parent.height()
      });
      setTimeout(function(){
        $('.js-index-sample').css({
          'top': 0,
          'left': 0,
          'right': 0,
          'bottom': 0
        });
      }, 10);
      setTimeout(function(){
        t.changePage(elem.attr('href'), function(){
          $('.js-page-changer').addClass('in-front active');
        });
        setTimeout(function(){
          pageChanger
            .removeClass('in-front active js-page-changer page-changer')
            .addClass('js-page-container page-container');
          pageContainer
            .removeClass('page-container js-page-container')
            .addClass('js-page-changer page-changer');
        }, 1000);
      }, 1000);
    }, 800);
  },
  init: function() {
    var t = this;
    $('.js-slide-link').on('mouseup touchend', function(){
      if(!$('.js-main-slider').hasClass('no-link')) {
        t.goFromMain($(this));
      }
    }).on('click', function(){
      return false;
    });
    /*window.onpopstate = function(e){
        if(e.state){
            document.getElementById("content").innerHTML = e.state.html;
            document.title = e.state.pageTitle;
        }
    };*/
  }
}