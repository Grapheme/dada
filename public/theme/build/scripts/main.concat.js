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
      fixed: function() {
        var thisParent = MainSlider.prototype;
        thisParent.move.status = false;
        thisParent.dom.parent.removeClass('shift');
        thisParent.move.setActive(thisParent.nextActive, true);
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
      if(self.status) {
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
    $(window).on('mousemove touchmove', function(e){
      self.move.shift(e);
    });
    $(window).on('mouseup touchend', function(){
      self.move.setStatus.fixed();
    });
    self.move.setActive(0);
  }
}
var Overlay = function() {
  this.init();
}
Overlay.prototype = {
  settings: {
    transitionDuration: 700
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
      $('.js-page-container').html(data.page);
      $('title').text(data.title);
      t.changeUrl(href, data);
      setTimeout(function(){
        new PageInit();
      }, 1);
      callback();
    });
  },
  goFromMain: function(href) {
    var t = this;
    t.changePage(href, function(){

    });
  },
  init: function() {
    var t = this;
    $('.js-slide-link').on('mouseup touchend', function(){
      if(!$('.js-main-slider').hasClass('no-link')) {
        t.goFromMain($(this).attr('href'));
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