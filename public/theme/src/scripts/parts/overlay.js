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