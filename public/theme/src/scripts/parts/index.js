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