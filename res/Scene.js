/**
 * @fileoverview Scene.js - Set up the scene
 * @author Ben Brooks (beb12@aber.ac.uk)
 * @version 1.0
 */

// Create a list of objects to iterate through when drawing and updating
var objects = new Array();

function initScene() {

  // Set a default Field of View
  setFoV(30);

  // For mouse controls
  theta = 0,
  phi   = 0;

  // Set clear colour to black, enable depth and alpha blending
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);
  gl.clearDepth(1.0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  // Add things to the objects list

  // Create a huge box textured with a starfield
  objects.push(new Skybox(10000, 'textures/starfield.png'));

  // Radius (0-1), Spin speed, Axial Tilt (deg), Orbit radius, Orbit speed, Orbit inclination (deg), Orbit Offset, Texture path
  objects.push(new Planet(1,    25.050,   0.00,  0,   0.000, 0.00, Math.random(), 'textures/sunmap.png'));
  objects.push(new Planet(0.1,  58.640,   0.00,  2,  47.873, 7.00, Math.random(), 'textures/mercurymap.jpg'));
  objects.push(new Planet(0.2, 243.018, 177.30,  4,  35.021, 3.39, Math.random(), 'textures/venusmap.jpg'));
  objects.push(new Planet(0.4, 100.997,  23.44,  6,  29.786, 0.00, Math.random(), 'textures/earthmap1k.jpg'));
  objects.push(new Planet(0.3, 101.026,  25.19,  8,  24.131, 1.85, Math.random(), 'textures/marsmap1k.jpg'));
  objects.push(new Planet(0.8, 100.414,   3.12, 14,  13.070, 1.31, Math.random(), 'textures/jupitermap.jpg'));
  objects.push(new Planet(0.6, 100.444,  26.73, 24,   9.672, 2.48, Math.random(), 'textures/saturnmap.jpg'));
  objects.push(new Planet(0.4, 100.718,  97.86, 34,   6.835, 0.76, Math.random(), 'textures/uranusmap.jpg'));
  objects.push(new Planet(0.3, 100.671,  29.58, 44,   5.478, 1.77, Math.random(), 'textures/neptunemap.jpg'));

  // Add boat loads of moons to planets, because why not?!
  objects.push(new Moon(objects[4], 0.1, -75, 0, 0.6, -700, 0, 'textures/moon.gif')); // Earth Moon
  objects.push(new Moon(objects[5], 0.01, 0, 0, 0.4, -500, 0, 'textures/moon.gif')); // Mars Phobos
  objects.push(new Moon(objects[5], 0.01, 0, 0, 0.8, -700, 0, 'textures/moon.gif')); // Mars Deimos
  objects.push(new Moon(objects[6], 0.05, 0, 0, 0.9, -300, 0, 'textures/moon.gif')); // Jupiter Io
  objects.push(new Moon(objects[6], 0.05, 0, 0, 1.4, -500, 0, 'textures/moon.gif')); // Jupiter Europa
  objects.push(new Moon(objects[6], 0.1, 0, 0, 1.8, -800, 0, 'textures/moon.gif')); // Jupiter Ganymede
  objects.push(new Moon(objects[6], 0.02, 0, 0, 2.2, -700, 0, 'textures/moon.gif')); // Jupiter Callisto
  objects.push(new Moon(objects[7], 0.02, 0, 0, 1.0, -800, 0, 'textures/moon.gif')); // Saturn Mimas
  objects.push(new Moon(objects[7], 0.02, 0, 0, 1.3, -700, 0, 'textures/moon.gif')); // Saturn Enceladus
  objects.push(new Moon(objects[7], 0.02, 0, 0, 1.7, -900, 0, 'textures/moon.gif')); // Saturn Tethys
  objects.push(new Moon(objects[7], 0.02, 0, 0, 2.0, -750, 0, 'textures/moon.gif')); // Saturn Dione
  objects.push(new Moon(objects[7], 0.02, 0, 0, 2.2, -820, 0, 'textures/moon.gif')); // Saturn Rhea
  objects.push(new Moon(objects[7], 0.05, 0, 0, 2.2, -720, 0, 'textures/moon.gif')); // Saturn Titan
  objects.push(new Moon(objects[9], 0.05, 0, 0, 1.0, -600, 0, 'textures/moon.gif')); // Neptune Triton

  // Create translucent things last (so no funny draw ordering issues arise)
  objects.push(new Ring(objects[7], 2, 'textures/saturnrings.png')); // Saturn's Rings

  // Initialise the shaders and texture functions
  initShaders();

  // Start the update and draw loops
  update();
  draw();

}

/**
 *
 */
function update() {

  // Loop through objects in scene and run update function
  // This is a reversed for loop (avoids objects.length lookup every cycle!)
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

  // Create the view matrix and rotate according to mouse input and defaults
  viewMatrix = mat4.create();
  mat4.translate(viewMatrix, viewMatrix, [0, 0, settings['zoom']]);
  mat4.rotateY(viewMatrix, viewMatrix, theta);
  mat4.rotateX(viewMatrix, viewMatrix, phi);
  mat4.rotateX(viewMatrix, viewMatrix, 10*(Math.PI/180));

  gl.viewport(0.0, 0.0, canvas.width, canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Loop through objects in scene and run draw function
  for (var i = 0; i < objects.length; i++) {
    objects[i].draw();
  };

  gl.flush();

  // Request animation frame from browser
  // (typical target 16.667ms/frame)
  requestAnimationFrame(draw);
}

/**
 *
 */
function setFoV(fovDegrees) {
  fovRadians = fovDegrees * (Math.PI/180);
  settings['fov'] = fovRadians;
  projMatrix = mat4.create();
  mat4.perspective(projMatrix, settings['fov'], canvas.width/canvas.height, 0.01, 100000);
}
