var _Pmatrix;
var _Mmatrix;
var _Vmatrix;
var _position;
var _colour;

function initShaders() {
  var fragmentShader = getShader(gl, "shader-fs");
  var vertexShader   = getShader(gl, "shader-vs");

  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, fragmentShader);
  gl.attachShader(shaderProgram, vertexShader);

  gl.linkProgram(shaderProgram);

  _Pmatrix = gl.getUniformLocation(shaderProgram, "Pmatrix");
  _Mmatrix = gl.getUniformLocation(shaderProgram, "Mmatrix");
  _Vmatrix = gl.getUniformLocation(shaderProgram, "Vmatrix");
  _position = gl.getAttribLocation(shaderProgram, "position");
  _normal = gl.getAttribLocation(shaderProgram, "normal");

  _uv = gl.getAttribLocation(shaderProgram, "uv");
  _sampler = gl.getUniformLocation(shaderProgram, "sampler");

  gl.enableVertexAttribArray(_position);
  gl.enableVertexAttribArray(_normal);
  gl.enableVertexAttribArray(_uv);

  gl.useProgram(shaderProgram);
  gl.uniform1i(_sampler, 0);
}

function getShader(gl, id) {

  var script = document.getElementById(id);
  if (!script) {
    return null;
  }

  var source = script.firstChild.textContent;
  var shader;

  switch(script.type) {
    case "x-shader/x-fragment":
      shader = gl.createShader(gl.FRAGMENT_SHADER);
      break;
    case "x-shader/x-vertex":
      shader = gl.createShader(gl.VERTEX_SHADER);
      break;
    default:
      console.log("Invalid shader type: "+script.type);
      return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;

}

function getTexture(imageURL) {
  var image = new Image();

  image.src = imageURL;
  image.webglTexture = false;

  image.onload=function(e) {
    var texture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
    image.webglTexture = texture;
  };

  return image;
}
