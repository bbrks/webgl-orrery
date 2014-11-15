/**
 * @fileoverview Planet.js - A planet object
 * @author Ben Brooks (beb12@aber.ac.uk)
 * @version 1.0
 */

function Skybox(size, textureURL) {

  var moveMatrix;

  this.size = size;
  this.texture = getTexture(textureURL);

  // This function draws the planets
  this.draw = function() {

    var mesh_verts = [
      -1*this.size,-1*this.size,-1*this.size,    0,0,
       1*this.size,-1*this.size,-1*this.size,    1,0,
       1*this.size, 1*this.size,-1*this.size,    1,1,
      -1*this.size, 1*this.size,-1*this.size,    0,1,

      -1*this.size,-1*this.size, 1*this.size,    0,0,
       1*this.size,-1*this.size, 1*this.size,    1,0,
       1*this.size, 1*this.size, 1*this.size,    1,1,
      -1*this.size, 1*this.size, 1*this.size,    0,1,

      -1*this.size,-1*this.size,-1*this.size,    0,0,
      -1*this.size, 1*this.size,-1*this.size,    1,0,
      -1*this.size, 1*this.size, 1*this.size,    1,1,
      -1*this.size,-1*this.size, 1*this.size,    0,1,

       1*this.size,-1*this.size,-1*this.size,    0,0,
       1*this.size, 1*this.size,-1*this.size,    1,0,
       1*this.size, 1*this.size, 1*this.size,    1,1,
       1*this.size,-1*this.size, 1*this.size,    0,1,

      -1*this.size,-1*this.size,-1*this.size,    0,0,
      -1*this.size,-1*this.size, 1*this.size,    1,0,
       1*this.size,-1*this.size, 1*this.size,    1,1,
       1*this.size,-1*this.size,-1*this.size,    0,1,

      -1*this.size, 1*this.size,-1*this.size,    0,0,
      -1*this.size, 1*this.size, 1*this.size,    1,0,
       1*this.size, 1*this.size, 1*this.size,    1,1,
       1*this.size, 1*this.size,-1*this.size,    0,1,
    ];

    var MESH_VERTEX = gl.createBuffer ();
    gl.bindBuffer(gl.ARRAY_BUFFER, MESH_VERTEX);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh_verts), gl.STATIC_DRAW);

    // 2 tris per square face
    var mesh_faces = [
      0,1,2,
      0,2,3,

      4,5,6,
      4,6,7,

      8,9,10,
      8,10,11,

      12,13,14,
      12,14,15,

      16,17,18,
      16,18,19,

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

  this.update = function() {
    moveMatrix = mat4.create();
  }

  return this;

}
