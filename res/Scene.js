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
  // Spin speed, Axial Tilt, Orbit radius, Orbit speed, Orbit inclination, Texture path
  objects.push(new Planet(  25.050,   0.00,   0.00,   0.000, 0.00, 'textures/sunmap.jpg'));
  objects.push(new Planet(  58.640,   0.00,   3.87,  47.873, 7.00, 'textures/mercurymap.jpg'));
  objects.push(new Planet(-243.018, 177.30,   7.23,  35.021, 3.39, 'textures/venusmap.jpg'));
  objects.push(new Planet(   100.997,  23.44,  10.00,  29.786, 0.00, 'textures/earthmap1k.jpg'));
  objects.push(new Planet(   101.026,  25.19,  15.24,  24.131, 1.85, 'textures/marsmap1k.jpg'));
  objects.push(new Planet(   100.414,   3.12,  52.03,  13.070, 1.31, 'textures/jupitermap.jpg'));
  objects.push(new Planet(   100.444,  26.73,  95.37,   9.672, 2.48, 'textures/saturnmap.jpg'));
  objects.push(new Planet(  -100.718,  97.86, 191.91,   6.835, 0.76, 'textures/uranusmap.jpg'));
  objects.push(new Planet(   100.671,  29.58, 300.69,   5.478, 1.77, 'textures/neptunemap.jpg'));

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
