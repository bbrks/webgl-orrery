/**
 * @fileoverview Scene.js - Set up the scene
 * @author Ben Brooks (beb12@aber.ac.uk)
 * @version 1.0
 */

function initScene() {

  update();
  draw();

}

/**
 *
 */
function update() {
  setTimeout(update, 1000 / 60);
}

/**
 *
 */
function draw() {

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  requestAnimationFrame(draw);
}
