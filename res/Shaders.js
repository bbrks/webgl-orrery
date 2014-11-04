var _position;

function initShaders() {
  var fragmentShader = getShader(gl, "shader-fs");
  var vertexShader   = getShader(gl, "shader-vs");

  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, fragmentShader);
  gl.attachShader(shaderProgram, vertexShader);

  gl.linkProgram(shaderProgram);
  _position = gl.getAttribLocation(shaderProgram, "position");
  gl.enableVertexAttribArray(_position);
  gl.useProgram(shaderProgram);
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
