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

  // Render at 4x native resolution to smooth out those mip-maps!
  var superSampleFactor = 4; // ((WARNING: PERFORMANCE LOSS))

  // set the display size of the canvas.
  var width  = canvas.clientWidth;
  var height = canvas.clientHeight;
  canvas.style.width  = width  + "px";
  canvas.style.height = height + "px";

  // set the size of the drawing buffer
  canvas.width  = width  * superSampleFactor;
  canvas.height = height * superSampleFactor;

  // Enable anti-aliasing
  glContext = canvas.getContext("webgl", {antialias: true}) ||
              canvas.getContext("experimental-webgl", {antialias: true});

  // Set viewport size
  glContext.viewportWidth  = canvas.width;
  glContext.viewportHeight = canvas.height;

  if (!glContext) {
    alert("Unable to initialise WebGL. Your browser may not support it.");
  }

  return glContext;

}
