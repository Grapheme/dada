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