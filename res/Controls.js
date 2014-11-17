var drag=false;
var old_x, old_y;

var mouseDown = function(e) {
  drag = true;
  old_x = e.pageX, old_y = e.pageY;
  e.preventDefault();
  return false;
};

var mouseUp = function(e){
  drag = false;
};

var mouseMove = function(e) {
  if (!drag) return false;
  var dX = e.pageX - old_x,
      dY = e.pageY - old_y;
  theta += dX * 2 * Math.PI / canvas.width;
  phi += dY * 2 * Math.PI / canvas.height;
  old_x = e.pageX, old_y = e.pageY;
  e.preventDefault();
};

var mouseScroll = function(e) {
  settings['zoom'] += e.wheelDeltaY*0.001;
  e.preventDefault();
}

function setZoom(zoom) {
  settings['zoom'] = zoom;
}

function setSimSpeed(simSpeed) {
  settings['simSpeed'] = simSpeed;
}
