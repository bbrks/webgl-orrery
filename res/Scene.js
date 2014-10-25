/**
 * @fileoverview Scene.js - Set up the scene
 * @author Ben Brooks (beb12@aber.ac.uk)
 * @version 1.0
 */

var objects = new Array();

function initScene() {

  objects.push(new Planet('Sun', 1, 0));
  objects.push(new Planet('Mercury', 1, 0));
  objects.push(new Planet('Venus', 1, 0));
  objects.push(new Planet('Earth', 1, 0));
  objects.push(new Planet('Mars', 1, 0));
  objects.push(new Planet('Saturn', 1, 0));
  objects.push(new Planet('Jupiter', 1, 0));
  objects.push(new Planet('Neptune', 1, 0));
  objects.push(new Planet('Pluto', 1, 0));

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

  setTimeout(update, 1000 / 60);
}

/**
 *
 */
function draw() {

  // Loop through objects in scene and run draw function
  for (var i = objects.length - 1; i >= 0; i--) {
    objects[i].draw();
  };

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  requestAnimationFrame(draw);
}
