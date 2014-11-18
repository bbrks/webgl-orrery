/**
 * @fileoverview script.js - JS Orrery - A CS323 Assignment
 * @author Ben Brooks (beb12@aber.ac.uk)
 * @version 1.0
 */

function init() {
  // Set up the canvas and load the scene
  canvas = document.getElementById('canvas');
  gl = initWebGL(canvas);
  initScene();

  // Add event listeners to grab mouse input
  canvas.addEventListener("mousedown", mouseDown, false);
  canvas.addEventListener("mouseup", mouseUp, false);
  canvas.addEventListener("mouseout", mouseUp, false);
  canvas.addEventListener("mousemove", mouseMove, false);
  canvas.addEventListener("mousewheel", mouseScroll, false);

  // Listen for changes to HTML controls and update settings
  var fovSlider = document.getElementById('fovSlider');
  fovSlider.addEventListener("input", function() {
    var val = document.getElementById('fovVal');
    val.innerText = fovSlider.value;
    setFoV(parseInt(fovSlider.value));
  });

  var zoomSlider = document.getElementById('zoomSlider');
  zoomSlider.addEventListener("input", function() {
    var val = document.getElementById('zoomVal');
    val.innerText = zoomSlider.value;
    setZoom(parseInt(zoomSlider.value));
  });

  var simSpeedSlider = document.getElementById('simSpeedSlider');
  simSpeedSlider.addEventListener("input", function() {
    var val = document.getElementById('simSpeedVal');
    val.innerText = simSpeedSlider.value;
    setSimSpeed(parseInt(simSpeedSlider.value));
  });

}

window.onload = init;
