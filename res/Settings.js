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
settings['simSpeed']     = 1.0;
settings['fov']          = 75;
