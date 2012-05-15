importClass(com.mowforth.rhinode.ModuleLoader);

var require = function(id) {

  if (id.substr(id.length-4, 4) == "json") {
    path = ModuleLoader.resolveDirect(id);
    var source = ModuleLoader.loadFile(path);
    return JSON.parse(source);
  }

  path = ModuleLoader.resolveParent(id);

  if (path != null) {
    var alreadyThere = false;
    nativeRequire.paths.forEach(function(p) {
      if (p == path) alreadyThere = true;
    });
    if (!alreadyThere) nativeRequire.paths.push(path);
    return nativeRequire(id);
  }

}

require.resolve = function(id) {
  return ModuleLoader.resolveString(id);
}

global = this;

var console = require('console');
var timers = require('timers');
var future = require('future');

this.console = console;
this.setTimeout = timers.setTimeout;
this.setInterval = timers.setInterval;
this.clearInterval = timers.clearInterval;
this.clearTimeout = timers.clearTimeout;

this.alert = function(msg) { javax.swing.JOptionPane.showMessageDialog(null, msg); };

Number.prototype.times = function(fn) {
  var i;
  for (i = 0; i < this; i++) {
    fn(i);
  }
};

