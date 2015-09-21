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