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

  var devicePixelRatio = window.devicePixelRatio || 1;
  var width  = canvas.clientWidth;
  var height = canvas.clientHeight;

  // set the display size of the canvas.
  canvas.style.width  = width  + "px";
  canvas.style.height = height + "px";

  // set the size of the drawingBuffer
  canvas.width  = width  * devicePixelRatio;
  canvas.height = height * devicePixelRatio;

  glContext = canvas.getContext("webgl", {antialias: true}) ||
              canvas.getContext("experimental-webgl", {antialias: true});

  glContext.viewportWidth  = canvas.width;
  glContext.viewportHeight = canvas.height;

  if (!glContext) {
    alert("Unable to initialise WebGL. Your browser may not support it.");
  }

  return glContext;

}
