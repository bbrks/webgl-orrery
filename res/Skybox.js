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

    // Todo: Put textured cube drawing here

  }

  // This function updates the positions of the planet
  this.update = function() {
  }

  return this;

}
