/**
 * @fileoverview Planet.js - A planet object
 * @author Ben Brooks (beb12@aber.ac.uk)
 * @version 1.0
 */

function Moon(parent, radius, spinSpeed, axialTilt, orbitRadius, orbitSpeed, orbitInclination, textureURL) {

  var moveMatrix;

  this.parent = parent;
  this.radius = radius;
  this.spinSpeed = spinSpeed*0.1*settings['simSpeed'];
  this.axialTilt = axialTilt*(Math.PI/180);
  this.orbitRadius = orbitRadius;
  this.orbitSpeed = orbitSpeed*0.01*settings['simSpeed'];
  this.orbitInclination = orbitInclination*(Math.PI/180);
  this.texture = getTexture(textureURL);

  // This function draws the planets
  this.draw = function() {

    var latitudeBands = 32;
    var longitudeBands = 32;
    var radius = this.radius;

    var vertexPositionData = [];
    var textureCoordData = [];

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

    if (this.texture.webglTexture) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture.webglTexture);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.vertexAttribPointer(_position, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
    gl.vertexAttribPointer(_uv, vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);

    gl.uniformMatrix4fv(_Pmatrix, false, projMatrix);
    gl.uniformMatrix4fv(_Mmatrix, false, moveMatrix);
    gl.uniformMatrix4fv(_Vmatrix, false, viewMatrix);

    gl.drawElements(gl.TRIANGLES, vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

  }

  var delta = 0;

  // This function updates the positions of the moon
  this.update = function() {
    delta += settings['simSpeed'];
    moveMatrix = mat4.create();

    // Set orbital inclination to be that of the parent planet
    mat4.rotateZ(moveMatrix, moveMatrix, this.parent.orbitInclination);

    // Rotate the moon, translate by orbit radius and then undo the rotation to preserve axial tilt of the parent planet
    mat4.rotateY(moveMatrix, moveMatrix, (delta*this.parent.orbitSpeed*(Math.PI/180))+this.parent.orbitOffset);
    mat4.translate(moveMatrix, moveMatrix, [this.parent.orbitRadius, 0, 0]);
    mat4.rotateY(moveMatrix, moveMatrix, -delta*this.parent.orbitSpeed*(Math.PI/180));

    // Tilt the moon and then spin of the parent planet
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
