/**
 * @fileoverview WebGL.js - Set up WebGL context
 * @author Ben Brooks (beb12@aber.ac.uk)
 * @version 1.0
 */

/**
 * Initialise the WebGL context and return it
 * @params canvas - HTML5 Canvas element
 */
function initWebGL(canvas) {

  glContext = canvas.getContext("webgl") ||
              canvas.getContext("experimental-webgl");

  if (!glContext) {
    alert("Unable to initialise WebGL. Your browser may not support it.");
  }

  return glContext;

}
