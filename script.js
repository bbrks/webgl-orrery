/**
 * @fileoverview script.js - JS Orrery - A CS323 Assignment
 * @author Ben Brooks (beb12@aber.ac.uk)
 * @version 1.0
 */

function init() {
  canvas = document.getElementById('canvas');
  gl = initWebGL(canvas);
  initScene();

  canvas.addEventListener("mousedown", mouseDown, false);
  canvas.addEventListener("mouseup", mouseUp, false);
  canvas.addEventListener("mouseout", mouseUp, false);
  canvas.addEventListener("mousemove", mouseMove, false);
  canvas.addEventListener("mousewheel", mouseScroll, false);

}

window.onload = init;
