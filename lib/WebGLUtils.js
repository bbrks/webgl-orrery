// Code used from Webgl Academy (http://webglacademy.com)
var WebGLUtils = {
  degToRad: function(angle){
    return(angle * Math.PI / 180);
  },

  get_projection: function(angle, a, zMin, zMax) {
    var tan = Math.tan(WebGLUtils.degToRad(0.5 * angle)),
        A   = -(zMax + zMin) / (zMax - zMin),
        B   = (-2 * zMax * zMin) / (zMax - zMin);

    return [
      .5/tan, 0 ,   0, 0,
      0, .5*a/tan,  0, 0,
      0, 0,         A, -1,
      0, 0,         B, 0
    ];
  },

};
