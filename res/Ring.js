/**
 * @fileoverview Ring.js - A ring object
 * @author Ben Brooks (beb12@aber.ac.uk)
 * @version 1.0
 */

/**
 * An object class to define a ring
 *
 * @param parent -  Parent object of the ring
 * @param size - Size of the ring
 * @param textureURL - A URL to an image to be used as a texture
 *
 * @returns ring - The ring
 */
function Ring(parent, size, textureURL) {

  // Set matrices
  var moveMatrix;

  this.parent = parent;
  this.size = size;
  this.texture = getTexture(textureURL);

  // This function draws the planets
  this.draw = function() {

    gl.disable(gl.CULL_FACE); // Disable backface culling for Rings

    var mesh_verts = [
      0,0,0,    0,0,
      0,0,0,    1,0,
      0,0,0,    1,1,
      0,0,0,    0,1,

      0,0,0,    0,0,
      0,0,0,    1,0,
      0,0,0,    1,1,
      0,0,0,    0,1,

      0,0,0,    0,0,
      0,0,0,    1,0,
      0,0,0,    1,1,
      0,0,0,    0,1,

      0,0,0,    0,0,
      0,0,0,    1,0,
      0,0,0,    1,1,
      0,0,0,    0,1,

      0,0,0,    0,0,
      0,0,0,    1,0,
      0,0,0,    1,1,
      0,0,0,    0,1,

      -1*this.size, 0*this.size,-1*this.size,    0,0,
      -1*this.size, 0*this.size, 1*this.size,    1,0,
       1*this.size, 0*this.size, 1*this.size,    1,1,
       1*this.size, 0*this.size,-1*this.size,    0,1,
    ];

    var MESH_VERTEX = gl.createBuffer ();
    gl.bindBuffer(gl.ARRAY_BUFFER, MESH_VERTEX);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh_verts), gl.STATIC_DRAW);

    // 2 tris per square face
    var mesh_faces = [
      0,0,0,
      0,0,0,

      0,0,0,
      0,0,0,

      0,0,0,
      0,0,0,

      0,0,0,
      0,0,0,

      0,0,0,
      0,0,0,

      20,21,22,
      20,22,23,
    ];
    var MESH_FACES = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, MESH_FACES);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                  new Uint16Array(mesh_faces),
      gl.STATIC_DRAW);

    gl.uniformMatrix4fv(_Pmatrix, false, projMatrix);
    gl.uniformMatrix4fv(_Mmatrix, false, moveMatrix);
    gl.uniformMatrix4fv(_Vmatrix, false, viewMatrix);

    // Disable lighting for Rings, or else we get weird pulsating lighting when it spins
    gl.uniform1i(_useLighting, false);

    if (this.texture.webglTexture) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture.webglTexture);
    }

    gl.vertexAttribPointer(_position, 3, gl.FLOAT, false,4*(3+2),0) ;
    gl.vertexAttribPointer(_uv, 2, gl.FLOAT, false,4*(3+2),3*4) ;

    gl.bindBuffer(gl.ARRAY_BUFFER, MESH_VERTEX);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, MESH_FACES);
    gl.drawElements(gl.TRIANGLES, 6*2*3, gl.UNSIGNED_SHORT, 0);

  }

  // A tick variable to increment the orbit positions
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
  }

  return this;

}
