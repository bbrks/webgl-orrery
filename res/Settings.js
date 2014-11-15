var settings = new Array();

function Setting(name, value) {

  this.name = name;
  this.value = value;

  return this;

}

settings['drawFPS']      = true;
settings['drawOrbits']   = true;
settings['drawTextures'] = true;
settings['drawLighting'] = true;
settings['fov']          = 1; // Field of view (radians)
settings['zoom']         = -20; // Translate Z of viewMatrix
settings['simSpeed']     = 1;
