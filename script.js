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

  ambientRSlider = document.getElementById('ambientR');
  ambientGSlider = document.getElementById('ambientG');
  ambientBSlider = document.getElementById('ambientB');
  ambientRSlider.addEventListener("input", updateAmbient);
  ambientGSlider.addEventListener("input", updateAmbient);
  ambientBSlider.addEventListener("input", updateAmbient);

  function updateAmbient() {
    var rVal = document.getElementById('ambientRVal');
    var gVal = document.getElementById('ambientGVal');
    var bVal = document.getElementById('ambientBVal');
    rVal.innerText = ambientRSlider.value;
    gVal.innerText = ambientGSlider.value;
    bVal.innerText = ambientBSlider.value;
    setAmbient(ambientRSlider.value, ambientGSlider.value, ambientBSlider.value);
  }

  pointRSlider = document.getElementById('pointR');
  pointGSlider = document.getElementById('pointG');
  pointBSlider = document.getElementById('pointB');
  pointRSlider.addEventListener("input", updatePointColor);
  pointGSlider.addEventListener("input", updatePointColor);
  pointBSlider.addEventListener("input", updatePointColor);

  function updatePointColor() {
    var rVal = document.getElementById('pointRVal');
    var gVal = document.getElementById('pointGVal');
    var bVal = document.getElementById('pointBVal');
    rVal.innerText = pointRSlider.value;
    gVal.innerText = pointGSlider.value;
    bVal.innerText = pointBSlider.value;
    setPointColor(pointRSlider.value, pointGSlider.value, pointBSlider.value);
  }

  pointXSlider = document.getElementById('pointX');
  pointYSlider = document.getElementById('pointY');
  pointZSlider = document.getElementById('pointZ');
  pointXSlider.addEventListener("input", updatePointPos);
  pointYSlider.addEventListener("input", updatePointPos);
  pointZSlider.addEventListener("input", updatePointPos);

  function updatePointPos() {
    var xVal = document.getElementById('pointXVal');
    var yVal = document.getElementById('pointYVal');
    var zVal = document.getElementById('pointZVal');
    xVal.innerText = pointXSlider.value;
    yVal.innerText = pointYSlider.value;
    zVal.innerText = pointZSlider.value;
    setPointPos(pointXSlider.value, pointYSlider.value, pointZSlider.value);
  }

}

window.onload = init;
