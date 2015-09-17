var Pages = function() {
  this.init();
}
Pages.prototype = {
  changeAllow: true,
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
      $('.js-page-changer').html(data.page);
      $('title').text(data.title);
      t.changeUrl(href, data);
      callback();
    });
  },
  goFromMain: function(elem) {
    var t = this;
    if(!t.changeAllow) return;
    t.changeAllow = false;
    var parent = elem.parent();
    var pageChanger = $('.js-page-changer');
    var pageContainer = $('.js-page-container');
    var content = parent.find('.js-slide-content');
    var contentClone = content.clone().addClass('content-changer');
    $('.js-main-slider').addClass('disabled');
    parent.addClass('opened');
    $('body').append(contentClone);
    contentClone.css({
      top: content.offset().top,
      left: content.offset().left
    });
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
          $('.js-page-changer')
            .addClass('in-front active')
            .find('.header__content').hide();
          setTimeout(function(){
            pageChanger
              .removeClass('in-front active js-page-changer page-changer')
              .addClass('js-page-container page-container');
            pageContainer
              .removeClass('page-container js-page-container')
              .addClass('js-page-changer page-changer');
            setTimeout(function(){
              $('.js-page-changer').empty();
              setTimeout(function(){
                new PageInit();
                t.changeAllow = true;
              }, 1);
            }, 1);
          }, 1000);
        });
      }, 1000);
    }, 300);
  },
  goNormal: function(href) {
    var t = this;
    if(href == window.location.href || !t.changeAllow) return;
    t.changeAllow = false;
    var pageChanger = $('.js-page-changer');
    var pageContainer = $('.js-page-container');
    t.changePage(href, function(){
      pageContainer.addClass('faded');
      pageChanger.addClass('in-front active');
      pageChanger
        .removeClass('in-front active js-page-changer page-changer')
        .addClass('js-page-container page-container');
      pageContainer
        .removeClass('page-container js-page-container')
        .addClass('js-page-changer page-changer');
      setTimeout(function(){
        pageContainer.removeClass('faded');
        setTimeout(function(){
          $('.js-page-changer').empty();
          $('.content-changer').remove();
          setTimeout(function(){
            new PageInit();
            t.changeAllow = true;
          }, 1);
        }, 1);
      }, 500);
    });
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
    $('.js-go-link').on('click', function(){
      var $this = $(this);
      if($this.hasClass('js-go-popup')) {
        $('.js-close-popup').trigger('click');
        setTimeout(function(){
          t.goNormal($this.attr('href'));
        }, 300);
      } else {
        t.goNormal($this.attr('href'));
      }
      return false;
    });
    window.onpopstate = function(e){
      // console.log(e);
      window.location.href = window.location.href;
      // console.log(window.location.href);
      // t.goNormal(window.location.href);
    };
  }
}