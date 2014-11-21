/**
 * @fileoverview Planet.js - A planet object
 * @author Ben Brooks (beb12@aber.ac.uk)
 * @version 1.0
 */

/**
 * An object class to define a planet
 *
 * @param radius - Radius of the planet
 * @param spinSpeed - Speed of spin
 * @param axialTilt - Axial tilt in degrees
 * @param orbitRadius - Radius of the orbit
 * @param orbitSpeed - Speed of the orbit
 * @param orbitInclination - Inclination of the orbit
 * @param orbitOffset - Starting position of the orbit
 * @param textureURL - A URL to an image to be used as a texture
 * @param bool flipNormals - Should we flip the normals?
 *
 * @returns planet - The planet
 */
function Planet(radius, spinSpeed, axialTilt, orbitRadius, orbitSpeed, orbitInclination, orbitOffset, textureURL, flipNormals) {

  // Set matrices
  var moveMatrix;
  var normalMatrix;

  // Set object variables and do a bit of maths (e.g. Degrees to Radians)
  this.radius      = radius;
  this.spinSpeed   = spinSpeed * 0.1 * settings['simSpeed'];
  this.axialTilt   = axialTilt * (Math.PI/180);
  this.orbitRadius = orbitRadius;
  this.orbitSpeed  = orbitSpeed * 0.01 * settings['simSpeed'];
  this.texture     = getTexture(textureURL);
  this.orbitOffset = orbitOffset * Math.PI; // 180 degrees, so planets always start in front of camera
  this.orbitInclination = orbitInclination * (Math.PI/180);

  // We want to flip normals on the Sun, so that having a point light inside illuminates the surface
  if (flipNormals) {
    this.flipNormals = -1;
  } else {
    this.flipNormals = 1;
  }

  // This is called in the Scene's draw loop
  this.draw = function() {

    // Enable backface culling (Disabled on certain elements, e.g. Skybox and Planetary rings)
    gl.enable(gl.CULL_FACE);

    // Define number of bands of sphere and the radius
    var latitudeBands = 28;
    var longitudeBands = 28;
    var radius = this.radius;

    // Set data arrays
    var vertexPositionData = [];
    var normalData = [];
    var textureCoordData = [];

    // Loop through latitude and longitude bands
    for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
      var theta = latNumber * Math.PI / latitudeBands;
      var sinTheta = Math.sin(theta);
      var cosTheta = Math.cos(theta);

      for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
        var phi = longNumber * 2 * Math.PI / longitudeBands;
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);

        var x = cosPhi * sinTheta;
        var y = cosTheta;
        var z = sinPhi * sinTheta;
        var u = 1 - (longNumber / longitudeBands);
        var v = 1 - (latNumber / latitudeBands);

        normalData.push(x*this.flipNormals);
        normalData.push(y*this.flipNormals);
        normalData.push(z*this.flipNormals);

        textureCoordData.push(u);
        textureCoordData.push(v);

        vertexPositionData.push(radius * x);
        vertexPositionData.push(radius * y);
        vertexPositionData.push(radius * z);
      }
    }

    // Do seperate loops for indexes
    var indexData = [];
    for (var latNumber=0; latNumber < latitudeBands; latNumber++) {
      for (var longNumber=0; longNumber < longitudeBands; longNumber++) {
        var first = (latNumber * (longitudeBands + 1)) + longNumber;
        var second = first + longitudeBands + 1;
        indexData.push(first);
        indexData.push(second);
        indexData.push(first + 1);

        indexData.push(second);
        indexData.push(second + 1);
        indexData.push(first + 1);
      }
    }

    // Set up buffers
    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
    normalBuffer.itemSize = 3;
    normalBuffer.numItems = normalData.length / 3;

    var vertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
    vertexTextureCoordBuffer.itemSize = 2;
    vertexTextureCoordBuffer.numItems = textureCoordData.length / 2;

    var vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
    vertexPositionBuffer.itemSize = 3;
    vertexPositionBuffer.numItems = vertexPositionData.length / 3;

    var vertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
    vertexIndexBuffer.itemSize = 1;
    vertexIndexBuffer.numItems = indexData.length;

    // Texture surfaces
    if (this.texture.webglTexture) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture.webglTexture);
    }

    // Bind buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.vertexAttribPointer(_position, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
    gl.vertexAttribPointer(_uv, vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(_normal, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);

    // Set matrices
    gl.uniformMatrix4fv(_Pmatrix, false, projMatrix);
    gl.uniformMatrix4fv(_Mmatrix, false, moveMatrix);
    gl.uniformMatrix4fv(_Vmatrix, false, viewMatrix);

    normalMatrix = mat3.create();
    mat4.toInverseMat3(moveMatrix, normalMatrix);
    mat3.transpose(normalMatrix, normalMatrix);
    gl.uniformMatrix3fv(_Nmatrix, false, normalMatrix);

    // If we are flipping the normals, then disable specular reflection to avoid weird things
    if (flipNormals) {
      gl.uniform1i(_useSpecular, false);
    } else {
      gl.uniform1i(_useSpecular, true);
    }
    gl.uniform1i(_useLighting, true);

    // Draw the planet
    gl.drawElements(gl.TRIANGLES, vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

  }

  // A tick variable to increment the orbit positions
  var delta = 0;

  // This function updates the positions of the planet
  this.update = function() {
    // Count up by simSpeed (used in rotations)
    delta += settings['simSpeed'];
    moveMatrix = mat4.create();

    // Set orbital inclination
    mat4.rotateZ(moveMatrix, moveMatrix, this.orbitInclination);

    // Rotate the planet, translate by orbit radius and then undo the rotation to preserve axial tilt
    mat4.rotateY(moveMatrix, moveMatrix, (delta*this.orbitSpeed*(Math.PI/180))+this.orbitOffset);
    mat4.translate(moveMatrix, moveMatrix, [this.orbitRadius, 0, 0]);
    mat4.rotateY(moveMatrix, moveMatrix, -delta*this.orbitSpeed*(Math.PI/180));

    // Tilt the planet and then spin
    mat4.rotateZ(moveMatrix, moveMatrix, this.axialTilt);
    mat4.rotateY(moveMatrix, moveMatrix, delta*this.spinSpeed*(Math.PI/180));
  }

  return this;

}
