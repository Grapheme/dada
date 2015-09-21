Dada = window.Dada || {};
DadaDictionary = window.DadaDictionary || {};
function mouseVelocity(e_init, e) {
  var x = e_init.clientX, 
      new_x,
      new_y,
      new_t,
      x_dist,
      y_dist,
      interval,velocity,
      y = e_init.clientY,
      t;
  if (e === false) {
    return 0;
  }
  t = e.time;
  if(e.clientX) {
    new_x = e.clientX;
    new_y = e.clientY;
  }
  if(e.originalEvent.touches || e.originalEvent.changedTouches) {
    new_x = e.originalEvent.touches[0].pageX || e.originalEvent.changedTouches[0].pageX;
    nex_y = e.originalEvent.touches[0].pageY || e.originalEvent.changedTouches[0].pageY;
  }
  new_t = Date.now();
  x_dist = new_x - x;
  y_dist = new_y - y;
  interval = new_t - t;
  x = new_x;
  y = new_y;
  velocity = Math.sqrt(x_dist*x_dist+y_dist*y_dist)/interval;
  return velocity;
}
function getTransformStr(str) {
  var pref = ['', '-webkit-'];
  var transform = '';
  $.each(pref, function(i, v) {
    transform += v + 'transform: ' + str + ';';
  });
  return transform;
}
var Contacts = function() {
  this.init();
}
Contacts.prototype = {
  init: function() {
    if(!$('#map').length) return;
    $('#map').empty();
    function initialize() {
      var mapOptions = {
        center: new google.maps.LatLng(55.757907, 37.611896),
        zoom: 17,
      };
      var map = new google.maps.Map(document.getElementById("map"), mapOptions);
      var myLatlng = new google.maps.LatLng(47.2248231, 39.7273844);
    }
    google.maps.event.addDomListener(window, 'load', initialize);
    initialize();
  }
}
var Input = function() {
  this.init();
}
Input.prototype = {
  focus: function(elem) {
    elem.addClass('active');
  },
  blur: function(elem) {
    if(elem.find('input').val() == '') {
      elem.removeClass('active');
    }
  },
  init: function() {
    var t = this;
    $('.js-input input').on('focus', function(){
      var parent = $(this).parent();
      t.focus(parent);
    }).on('focusout', function(){
      var parent = $(this).parent();
      t.blur(parent);
    });
  }
}
var MainSlider = function() {
  this.init();
}
MainSlider.prototype = {
  dom: {},
  activeFrame: false,
  activeIndex: false,
  nextActive: false,
  activeX: 0,
  timeouts: {
    setActive: false,
    animate: false
  },
  move: {
    status: false,
    iosEvent: {},
    templates: {
      center: {
        translateX: 0,
      },
      next: {
        translateX: 103,
      },
      prev: {
        translateX: -103,
      },
      nextAll: {
        translateX: 206,
      },
      prevAll: {
        translateX: -206,
      }
    },
    lastE: false,
    setStatus: {
      active: function(e) {
        var thisParent = MainSlider.prototype;
        if(!thisParent.move.status) {
          thisParent.move.status = {}
          $.extend(thisParent.move.status, e);
          if(!thisParent.move.status.pageX) {
            thisParent.move.status.pageX = e.originalEvent.touches[0].pageX || e.originalEvent.changedTouches[0].pageX;
          }
          thisParent.dom.parent.addClass('shift');
        }
      },
      fixed: function(sactive) {
        var thisParent = MainSlider.prototype;
        thisParent.move.status = false;
        thisParent.dom.parent.removeClass('shift');
        if(!sactive && thisParent.dom.parent.hasClass('no-link')) {
          thisParent.move.setActive(thisParent.nextActive, true);
        }
      }
    },
    setCss: function(elem, type, obj) {
      var template = obj ? obj : this.templates[type];
      elem.css({
        transform: 'translateX(' + template.translateX + '%)',
      });
    },
    setActive: function(eq, animated) {
      var self = this;
      var thisParent = MainSlider.prototype;
      var thisFrame = thisParent.dom.slide.eq(eq);
      var setActiveTime = 0;
      thisParent.activeFrame = thisFrame;
      thisParent.activeIndex = eq;
      if(animated) {
        setActiveTime = 10;
        thisParent.dom.slide.addClass('animated');
        thisParent.timeouts.animate = setTimeout(function(){
          thisParent.dom.slide.removeClass('animated');
        }, 510);
      }
      thisParent.timeouts.setActive = setTimeout(function(){
        thisFrame.addClass('active')
          .siblings().removeClass('active');
        self.setCss(thisFrame, 'center');
        self.setCss(thisFrame.next(), 'next');
        self.setCss(thisFrame.prev(), 'prev');
        self.setCss(thisFrame.next().nextAll(), 'nextAll');
        self.setCss(thisFrame.prev().prevAll(), 'prevAll');
      }, setActiveTime);
      thisParent.dom.parent.removeClass('no-link');
    },
    shift: function(e) {
      var self = this;
      var thisParent = MainSlider.prototype;
      var localShift = function(frame, type, x, cof, reverse) {
        var thisObj = {},
            thisTemp = self.templates[type],
            translateX = thisTemp.translateX;
        if(reverse) {
          thisObj.translateX = translateX + (translateX - translateX/100*x);
        } else {
          thisObj.translateX = cof*(translateX/100)*x;
        }
        self.setCss(frame, false, thisObj);
      }
      var slide = {
        right: function(thisX) {
          localShift(thisParent.activeFrame, 'next', thisX, -1);
          localShift(thisParent.activeFrame.next(), 'next', (-100+thisX), -1);
          localShift(thisParent.activeFrame.prev(), 'prev', (100-thisX), 1, true);
          localShift(thisParent.activeFrame.prev().prev(), 'prevAll', (100-thisX/2), 1, true);
        },
        left: function(thisX) {
          localShift(thisParent.activeFrame, 'prev', thisX, 1);
          localShift(thisParent.activeFrame.prev(), 'prev', (100-thisX), 1, true);
          localShift(thisParent.activeFrame.next(), 'next', (100-thisX), 1);
          localShift(thisParent.activeFrame.next().next(), 'nextAll', (100-thisX/2), 1);
        }
      };
      if(self.status && !thisParent.dom.parent.hasClass('disabled')) {
        e.preventDefault();
        thisParent.nextActive = thisParent.activeIndex;
        var startPos = self.status.pageX;
        if(e.type == 'mousemove') {
          var movePos = e.pageX;
        } else {
          var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
          var movePos = touch.pageX;
        }
        var x = (startPos - movePos)/($(window).width()/100);
        if(Math.abs(x) > 1) {
          thisParent.dom.parent.addClass('no-link');
        } else {
          thisParent.dom.parent.removeClass('no-link');
        }
        if(x < 0) {// to right
          if(thisParent.activeIndex != 0) {
            slide.right(x*1.2);
          } else {
            slide.right(x/15);
            return;
          }
        } else {// to left
          if(thisParent.activeIndex != thisParent.dom.slide.length - 1) {
            slide.left(x*1.2);
          } else {
            slide.left(x/15);
            return;
          }
        }
        var diffToChange = 25;
        e.time = Date.now();
        var mouseSpeed = mouseVelocity(e, self.lastE);
        self.lastE = e;
        if(x > diffToChange || (mouseSpeed > 1 && x > 0)) {
          thisParent.nextActive = thisParent.activeIndex + 1;
          return;
        }
        if(x < -diffToChange || (mouseSpeed > 1 && x < 0)) {
          thisParent.nextActive = thisParent.activeIndex - 1;
          return;
        }
      }
    }
  },
  init: function() {
    var self = this;
    self.dom.parent = $('.js-main-slider');
    self.dom.slide = self.dom.parent.find('.js-slide');
    self.dom.slide.on('mousedown touchstart', function(e){
      self.move.setStatus.active(e);
    });
    self.dom.slide.on('click', '.js-slide-left, .js-slide-right', function(){
      if($(this).hasClass('js-slide-left')) {
        var nextIndex = self.activeIndex - 1;
      }
      if($(this).hasClass('js-slide-right')) {
        var nextIndex = self.activeIndex + 1;
      }
      if(nextIndex >= 0 && nextIndex < self.dom.slide.length) {
        self.move.setActive(nextIndex, true);
      }
      return false;
    });
    $(window).on('mousemove touchmove', function(e){
      self.move.shift(e);
    });
    $(window).on('mouseup touchend', function(e){
      if($(e.target).hasClass('js-slide-link')) {
        self.move.setStatus.fixed();
      } else {
        self.move.setStatus.fixed(true);
      }
    });
    var mouseAllow = true;
    $(document).on('mousewheel', '.js-main-slider', function(event) {
      event.preventDefault();
      if(!mouseAllow) return;
      var nextIndex = false;
      var cof = 10;
      if(event.deltaX > cof || event.deltaY < -cof) {
        var nextIndex = self.activeIndex + 1;
      } else
      if(event.deltaX < -cof || event.deltaY > cof) {
        var nextIndex = self.activeIndex - 1;
      }
      if(nextIndex !== false && nextIndex < self.dom.slide.length && nextIndex >= 0) {
        self.move.setActive(nextIndex, true);
        mouseAllow = false;
        setTimeout(function(){
          mouseAllow = true;
        }, 1000);
      }
    });
    self.dom.slide.first().find('.js-slide-left').hide();
    self.dom.slide.last().find('.js-slide-right').hide();
    self.move.setActive(0);
    self.dom.parent.addClass('active');
  }
}
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
  projects: {
    mobileWidth: 769,
    getScreenType: function() {
      var t = this;
      if($(window).width() < t.mobileWidth) {
        return 'mobile';
      } else {
        return 'desktop';
      }
    },
    filter: function(type) {
      $('.js-projects-filter[data-type="' + type + '"]').addClass('active')
        .siblings().removeClass('active');
      if(type == 0) {
        $('.js-project').show();
      } else {
        $('.js-project').hide();
        $('.js-project[data-type="' + type + '"]').show();
      }
      $('.js-customScroll').mCustomScrollbar('update');
    },
    setBlocks: function() {
      var t = this;
      var projects = Dictionary.projects;
      if(t.getScreenType() == 'mobile') {
        var thisBlocks = ['left', 'center'];
      } else {
        var thisBlocks = ['left', 'center', 'right'];
      }
      $('.js-project-block').empty();
      var i = 0;
      $.each(projects, function(index, value){
        var thisBlock = $('.js-project-block[data-position="' + thisBlocks[i] + '"]');
        thisBlock.append('<div class="block__item js-project" data-type="' + value.type_id + '">' +
                            '<div class="item__image"><a href="' + value.url + '" class="js-go-link js-go-popup"><img alt="' + value.name + '" src="' + value.image + '"></a></div>' +
                            '<div class="item__tag"><a href="' + value.url + '" class="js-go-link js-go-popup">' + Dictionary.types[value.type_id] + '</a></div>' +
                            '<div class="item__name"><a href="' + value.url + '" class="js-go-link js-go-popup">' + value.name + '</a></div>' +
                          '</div>');
        i++;
        if(i == thisBlocks.length) i = 0;
      });
    },
    init: function() {
      var t = this;
      var types = Dictionary.types;
      var typesHtml = [];
      $.each(types, function(i, v){
        typesHtml.push('<a href="#" data-type="' + i + '" class="js-projects-filter nav__link us-link">' + v + '</a>');
      });
      $('.js-types').html(typesHtml.join(''));
      t.setBlocks();
      var activeScreenType = t.getScreenType();
      $(window).on('resize', function(){
        thisType = t.getScreenType();
        if(thisType != activeScreenType) {
          activeScreenType = thisType;
          t.setBlocks();
        }
      });
      t.filter(0);
      $(document).on('click', '.js-projects-filter', function(){
        var thisType = $(this).attr('data-type');
        t.filter(thisType);
      });
    }
  },
  init: function() {
    var t = this;
    $('.js-show-popup').on('click', function(){
      t.show($(this).attr('data-popup'));
      return false;
    });
    $('.js-close-popup').on('click', function(){
      t.close($(this).parents('[data-name]').attr('data-name'));
      return false;
    });
    $('.js-popup').on('click', function(e){
      if($(e.target).hasClass('js-popup') || $(e.target).hasClass('projects-wrapper')) {
        t.close($(this).attr('data-name'));
        return false;
      }
    });
    t.projects.init();
  }
}
var Pages = function() {
  this.init();
}
Pages.prototype = {
  changeAllow: true,
  getPage: function(href, callback) {
    $.get(href)
      .done(function(responce){
        var data = {};
        var images = [];
        $.each($(responce), function(i, v){
          if($(v).is('title')) {
            data.title = $(v).text();
            return;
          };
          if(v.className && $(v).hasClass('js-page-container')) {
            data.page = v;
            return;
          };
          if($(v).is('img')) {
            images.push($(v).attr('src'));
            $('html').prepend('<img src="' + $(v).attr('src') + '">');
            return;
          }
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
      // window.location.href = window.location.href;
      // console.log(window.location.href);
      // t.goNormal(window.location.href);
    };
  }
}
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