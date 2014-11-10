/**
 * @fileoverview Scene.js - Set up the scene
 * @author Ben Brooks (beb12@aber.ac.uk)
 * @version 1.0
 */

var objects = new Array();

function initScene() {

  projMatrix = mat4.create();
  mat4.perspective(projMatrix, settings['fov'], canvas.width/canvas.height, 0.01, 10000);

  theta = 0,
  phi   = 0;

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearDepth(1.0);

  // Semi-accurate data taken from http://en.wikipedia.org/wiki/List_of_gravitationally_rounded_objects_of_the_Solar_System#Planets
  // Spin speed, Axial Tilt, Orbit radius, Orbit speed, Orbit inclination
  // objects.push(new Planet(   0.000,   0.00,   0.00,   0.000, 0.00));
  // objects.push(new Planet(  58.640,   0.00,   3.87,  47.873, 7.00));
  // objects.push(new Planet(-243.018, 177.30,   7.23,  35.021, 3.39));
  // objects.push(new Planet(   0.997,  23.44,  10.00,  29.786, 0.00));
  // objects.push(new Planet(   1.026,  25.19,  15.24,  24.131, 1.85));
  // objects.push(new Planet(   0.414,   3.12,  52.03,  13.070, 1.31));
  // objects.push(new Planet(   0.444,  26.73,  95.37,   9.672, 2.48));
  // objects.push(new Planet(  -0.718,  97.86, 191.91,   6.835, 0.76));
  // objects.push(new Planet(   0.671,  29.58, 300.69,   5.478, 1.77));

  objects.push(new Planet(0, 0, 0, 0, 0)); // Sun
  objects.push(new Planet(1, 20, 10, 1, 0)); // Earth
  objects.push(new Moon(objects[1]));

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

  viewMatrix = mat4.create();
  mat4.translate(viewMatrix, viewMatrix, [0, 0, settings['zoom']]);
  mat4.rotateY(viewMatrix, viewMatrix, theta);
  mat4.rotateX(viewMatrix, viewMatrix, phi);
  mat4.rotateX(viewMatrix, viewMatrix, 45*(Math.PI/180));

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
