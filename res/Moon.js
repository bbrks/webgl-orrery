/**
 * @fileoverview Moon.js - A moon object
 * @author Ben Brooks (beb12@aber.ac.uk)
 * @version 1.0
 */

/**
 * An object class to define a moon
 *
 * @param parent - Parent object of the moon
 * @param radius - Radius of the moon
 * @param spinSpeed - Speed of spin
 * @param axialTilt - Axial tilt in degrees
 * @param orbitRadius - Radius of the orbit
 * @param orbitSpeed - Speed of the orbit
 * @param orbitInclination - Inclination of the orbit
 * @param textureURL - A URL to an image to be used as a texture
 *
 * @returns moon - The moon
 */
function Moon(parent, radius, spinSpeed, axialTilt, orbitRadius, orbitSpeed, orbitInclination, textureURL) {

  // Set matrices
  var moveMatrix;
  var normalMatrix;

  // Set object variables and do a bit of maths (e.g. Degrees to Radians)
  this.parent      = parent;
  this.radius      = radius;
  this.spinSpeed   = spinSpeed * 0.1 * settings['simSpeed'];
  this.axialTilt   = axialTilt * (Math.PI/180);
  this.orbitRadius = orbitRadius;
  this.orbitSpeed  = orbitSpeed * 0.01 * settings['simSpeed'];
  this.texture     = getTexture(textureURL);
  this.orbitInclination = orbitInclination * (Math.PI/180);

  // This is called in the Scene's draw loop
  this.draw = function() {

    // Enable backface culling (Disabled on certain elements, e.g. Skybox and Planetary rings)
    gl.enable(gl.CULL_FACE);

    // Define number of bands of sphere and the radius
    // (number reduced for moons to improve performance)
    var latitudeBands = 16;
    var longitudeBands = 16;
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

        textureCoordData.push(u);
        textureCoordData.push(v);
        normalData.push(x);
        normalData.push(y);
        normalData.push(z);
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

    gl.uniform1i(_useSpecular, true);
    gl.uniform1i(_useLighting, true);

    // Draw the moon
    gl.drawElements(gl.TRIANGLES, vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

  }

  // A tick variable to increment the orbit positions
  var delta = 0;

  // This function updates the positions of the moon
  this.update = function() {
    // Count up by simSpeed (used in rotations)
    delta += settings['simSpeed'];
    moveMatrix = mat4.create();

    // Do same transformations as parent object (described in Planet.js)
    mat4.rotateZ(moveMatrix, moveMatrix, this.parent.orbitInclination);
    mat4.rotateY(moveMatrix, moveMatrix, (delta*this.parent.orbitSpeed*(Math.PI/180))+this.parent.orbitOffset);
    mat4.translate(moveMatrix, moveMatrix, [this.parent.orbitRadius, 0, 0]);
    mat4.rotateY(moveMatrix, moveMatrix, -delta*this.parent.orbitSpeed*(Math.PI/180));
    mat4.rotateZ(moveMatrix, moveMatrix, this.parent.axialTilt);
    mat4.rotateY(moveMatrix, moveMatrix, delta*this.parent.spinSpeed*(Math.PI/180));

    // Set orbital inclination
    mat4.rotateZ(moveMatrix, moveMatrix, this.orbitInclination);

    // Rotate the moon, translate by orbit radius and then undo the rotation to preserve axial tilt
    mat4.rotateY(moveMatrix, moveMatrix, delta*this.orbitSpeed*(Math.PI/180));
    mat4.translate(moveMatrix, moveMatrix, [this.orbitRadius, 0, 0]);
    mat4.rotateY(moveMatrix, moveMatrix, -delta*this.orbitSpeed*(Math.PI/180));

    // Tilt the moon and then spin
    mat4.rotateZ(moveMatrix, moveMatrix, this.axialTilt);
    mat4.rotateY(moveMatrix, moveMatrix, delta*this.spinSpeed*(Math.PI/180));
  }

  return this;

}
