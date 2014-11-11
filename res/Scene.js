/**
 * @fileoverview Scene.js - Set up the scene
 * @author Ben Brooks (beb12@aber.ac.uk)
 * @version 1.0
 */

var objects = new Array();

function initScene() {

  projMatrix = mat4.create();
  mat4.perspective(projMatrix, settings['fov'], canvas.width/canvas.height, 0.01, 100000);

  theta = 0,
  phi   = 0;

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearDepth(1.0);

  // Semi-accurate data taken from http://en.wikipedia.org/wiki/List_of_gravitationally_rounded_objects_of_the_Solar_System#Planets
  // Radius (0-1), Spin speed (0-1), Axial Tilt (deg), Orbit radius, Orbit speed(0-1), Orbit inclination (deg), Texture path
  objects.push(new Planet(10000,       0,   45,   0.00,   0.000, 0.00, 'textures/starfield.png'));
  objects.push(new Planet(1,       25.050,   0.00,   0.00,   0.000, 0.00, 'textures/sunmap.jpg'));
  objects.push(new Planet(0.25,    58.640,   0.00,   2,  47.873, 7.00, 'textures/mercurymap.jpg'));
  objects.push(new Planet(0.3,   243.018, 177.30,   4,  35.021, 3.39, 'textures/venusmap.jpg'));
  objects.push(new Planet(0.5,    100.997,  23.44,  6,  29.786, 0.00, 'textures/earthmap1k.jpg'));
  objects.push(new Planet(0.4,    101.026,  25.19,  8,  24.131, 1.85, 'textures/marsmap1k.jpg'));
  objects.push(new Planet(0.8,    100.414,   3.12,  10,  13.070, 1.31, 'textures/jupitermap.jpg'));
  objects.push(new Planet(0.6,    100.444,  26.73,  12,   9.672, 2.48, 'textures/saturnmap.jpg'));
  objects.push(new Planet(0.5,   100.718,  97.86, 14,   6.835, 0.76, 'textures/uranusmap.jpg'));
  objects.push(new Planet(0.4,    100.671,  29.58, 16,   5.478, 1.77, 'textures/neptunemap.jpg'));

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
  mat4.rotateX(viewMatrix, viewMatrix, 25*(Math.PI/180));

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
