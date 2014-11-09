/**
 * @fileoverview Scene.js - Set up the scene
 * @author Ben Brooks (beb12@aber.ac.uk)
 * @version 1.0
 */

var objects = new Array();

function initScene() {

  projMatrix = WebGLUtils.get_projection(settings['fov'], canvas.width/canvas.height, 0.01, 10000);
  viewMatrix = WebGLUtils.get_I4();
  WebGLUtils.translateZ(viewMatrix, -5);
  theta = 0,
  phi   = 0;

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearDepth(1.0);

  objects.push(new Planet('Sun', 1, 0));

  initShaders();

  update();
  draw();

}

/**
 *
 */
function update() {

  // Loop through objects in scene and run update function
  for (var i = objects.length - 1; i >= 0; i--) {
    objects[i].update();
  };

  // Loop update function every 16.667ms if possible
  setTimeout(update, 1000 / 60);
}

/**
 *
 */
function draw() {

  gl.viewport(0.0, 0.0, canvas.width, canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Loop through objects in scene and run draw function
  for (var i = objects.length - 1; i >= 0; i--) {
    objects[i].draw();
  };

  gl.flush();

  // Request animation frame from browser
  // (typical target 16.667ms/frame)
  requestAnimationFrame(draw);
}
