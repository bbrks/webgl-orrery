/**
 * @fileoverview WebGL.js - Set up WebGL context
 * @author Ben Brooks (beb12@aber.ac.uk)
 * @version 1.0
 */

/**
 * Initialise the WebGL context and return it
 *
 * @params canvas - HTML5 Canvas element
 *
 * @returns glContext - The WebGL Context
 */
function initWebGL(canvas) {

  // If using a HiDPI or Retina display, scale canvas, else use factor of 1
  var devicePixelRatio = window.devicePixelRatio || 1;

  // set the display size of the canvas.
  var width  = canvas.clientWidth;
  var height = canvas.clientHeight;
  canvas.style.width  = width  + "px";
  canvas.style.height = height + "px";

  // set the size of the drawing buffer
  // Then multiply by 2 for super sampling anti aliasing (makes mip-maps look much nicer)
  canvas.width  = width  * devicePixelRatio * 2;
  canvas.height = height * devicePixelRatio * 2;

  // Enable anti-aliasing (although not really needed since we're super sampling)
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
