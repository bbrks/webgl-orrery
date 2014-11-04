/**
 * @fileoverview script.js - JS Orrery - A CS323 Assignment
 * @author Ben Brooks (beb12@aber.ac.uk)
 * @version 1.0
 */

function init() {
  canvas = document.getElementById('canvas');
  gl = initWebGL(canvas);
  initScene();
}

window.onload = init;
