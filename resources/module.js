var corePath = com.sprintstack.Environment.corePath();
nativeRequire.paths.push(corePath);

var loadFile = function(path) {
  var _files = java.nio.file.Files;

  var bytes = _files.readAllBytes(path);
  return new java.lang.String(bytes).toString();
}

var require = function(id) {
  var _paths = java.nio.file.Paths;
  var _files = java.nio.file.Files;

  var path = _paths.get(id);

  // Look for core module
  var coreModPath = _paths.get(corePath + '/' + id + '.js');
  if (_files.exists(coreModPath))
    return nativeRequire(id + '.js')

  // Pull in a relative path
  if (id.indexOf('.') == 0)
    return nativeRequire(id);

  // Look for a node_modules folder containing 'id'
  if (module) {
    var moduri = new java.net.URI(module.uri);
    var npmPath = _paths.get(moduri).getParent();
    while (!_files.isDirectory(npmPath.resolve('node_modules/' + id))) {
      if (npmPath.getParent() == null) break;
      npmPath = npmPath.getParent();
    }

    // If we've not fully ascended the FS tree,
    // assume we've found the npm module
    if (npmPath.getParent()) {
      var packageJsonPath = npmPath.resolve('node_modules/' + id + '/package.json');
      var packageJson = JSON.parse(loadFile(packageJsonPath));

      if (packageJson.main) {
        var thisMod = _paths.get(moduri).getParent();
        var entryPoint = packageJsonPath.getParent().resolve(packageJson.main).normalize()
        var relative = './' + thisMod.relativize(entryPoint);
        return nativeRequire(relative)
      }
    }
  }
}


global = this;

var console = require('console');
var timers = require('timers');
var future = require('future');
var actor = require('actor');
var process = require('process');

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

