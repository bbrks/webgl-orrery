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

  objects.push(new Skybox(10000, 'textures/starfield.png'));

  // Radius (0-1), Spin speed, Axial Tilt (deg), Orbit radius, Orbit speed, Orbit inclination (deg), Texture path
  objects.push(new Planet(1,    25.050,   0.00,  0,   0.000, 0.00, 'textures/sunmap.png'));
  objects.push(new Planet(0.1,  58.640,   0.00,  2,  47.873, 7.00, 'textures/mercurymap.jpg'));
  objects.push(new Planet(0.2, 243.018, 177.30,  4,  35.021, 3.39, 'textures/venusmap.jpg'));
  objects.push(new Planet(0.4, 100.997,  23.44,  6,  29.786, 0.00, 'textures/earthmap1k.jpg'));
  objects.push(new Planet(0.3, 101.026,  25.19,  8,  24.131, 1.85, 'textures/marsmap1k.jpg'));
  objects.push(new Planet(0.8, 100.414,   3.12, 14,  13.070, 1.31, 'textures/jupitermap.jpg'));
  objects.push(new Planet(0.6, 100.444,  26.73, 24,   9.672, 2.48, 'textures/saturnmap.jpg'));
  objects.push(new Planet(0.4, 100.718,  97.86, 34,   6.835, 0.76, 'textures/uranusmap.jpg'));
  objects.push(new Planet(0.3, 100.671,  29.58, 44,   5.478, 1.77, 'textures/neptunemap.jpg'));

  objects.push(new Moon(objects[4], 0.1, 0, 0, 0.6, 1000, 0, 'textures/moon.gif')); // Earth Moon
  objects.push(new Ring(objects[7], 2, 'textures/ringsRGBA.png')); // Saturn's Rings

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

  // Create the view matrix and rotate according to mouse input
  viewMatrix = mat4.create();
  mat4.translate(viewMatrix, viewMatrix, [0, 0, settings['zoom']]);
  mat4.rotateY(viewMatrix, viewMatrix, theta);
  mat4.rotateX(viewMatrix, viewMatrix, phi);
  mat4.rotateX(viewMatrix, viewMatrix, 25*(Math.PI/180));

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
