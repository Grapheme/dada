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