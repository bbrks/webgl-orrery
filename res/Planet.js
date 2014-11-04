/**
 * @fileoverview Planet.js - A planet object
 * @author Ben Brooks (beb12@aber.ac.uk)
 * @version 1.0
 */

function Planet(name, radius, orbitRadius) {

  if ('undefined' === typeof name) {
    this.name = 'Planet';
  } else {
    this.name = name;
  }

  if ('undefined' === typeof radius) {
    this.radius = 1;
  } else {
    this.radius = radius;
  }

  if ('undefined' === typeof orbitRadius) {
    this.orbitRadius = 0;
  } else {
    this.orbitRadius = orbitRadius;
  }

  // This function draws the planets
  this.draw = function() {
    var triangle_vertex=[
      -1, -1, //first summit -> bottom left of the viewport
       0, 0, 1,
       1, -1, //bottom right of the viewport
       1, 1, 0,
       1,  1,  //top right of the viewport
       1, 0, 0
    ];

    var TRIANGLE_VERTEX = gl.createBuffer ();
    gl.bindBuffer(gl.ARRAY_BUFFER, TRIANGLE_VERTEX);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangle_vertex), gl.STATIC_DRAW);

    var triangle_faces = [0, 1, 2];
    var TRIANGLE_FACES = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                  new Uint16Array(triangle_faces),
      gl.STATIC_DRAW);

    gl.vertexAttribPointer(_position, 2, gl.FLOAT, false,4*(2+3),0) ;
    gl.vertexAttribPointer(_colour, 3, gl.FLOAT, false,4*(2+3),2*4) ;
    gl.bindBuffer(gl.ARRAY_BUFFER, TRIANGLE_VERTEX);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);
  }

  // This function updates the positions of the planet
  this.update = function() {
    // TODO
    // console.log('update '+ this.name);
  }

  return this;

}
