/**
 * @fileoverview script.js - JS Orrery - A CS323 Assignment
 * @author Ben Brooks (beb12@aber.ac.uk)
 * @version 1.0
 * @uses gl-matrix.js - Brandon Jones & Colin MacKenzie IV
 */

var gl;

function init() {
  canvas = document.getElementById('canvas');
  gl = initWebGL(canvas);
}

window.onload = init;
