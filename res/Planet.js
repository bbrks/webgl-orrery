/**
 * @fileoverview Planet.js - A planet object
 * @author Ben Brooks (beb12@aber.ac.uk)
 * @version 1.0
 */

function Planet(radius, spinSpeed, axialTilt, orbitRadius, orbitSpeed, orbitInclination, orbitOffset, textureURL) {

  // Set matrices
  var moveMatrix;
  var normalMatrix;

  // Set object variables and do a bit of maths (e.g. Degrees to Radians)
  this.radius = radius;
  this.spinSpeed = spinSpeed*0.1*settings['simSpeed'];
  this.axialTilt = axialTilt*(Math.PI/180);
  this.orbitRadius = orbitRadius;
  this.orbitSpeed = orbitSpeed*0.01*settings['simSpeed'];
  this.orbitInclination = orbitInclination*(Math.PI/180);
  this.texture = getTexture(textureURL);
  this.orbitOffset = orbitOffset*Math.PI*2;

  // This is called in the Scene's draw loop
  this.draw = function() {

    // Define bands of sphere and radius
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

        normalData.push(x);
        normalData.push(y);
        normalData.push(z);

        textureCoordData.push(u);
        textureCoordData.push(v);
        vertexPositionData.push(radius * x);
        vertexPositionData.push(radius * y);
        vertexPositionData.push(radius * z);
      }
    }

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

    gl.uniform1i(_useLighting, true);

    // Draw the planet
    gl.drawElements(gl.TRIANGLES, vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

  }

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
