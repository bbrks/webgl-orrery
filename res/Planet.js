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
    // TODO
    // console.log('draw '+ this.name);
  }

  // This function updates the positions of the planet
  this.update = function() {
    // TODO
    // console.log('update '+ this.name);
  }

  return this;

}
