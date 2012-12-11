var __corePath = com.sprintstack.Environment.corePath();


var loadFile = function(path) {
  var _files = java.nio.file.Files;

  var bytes = _files.readAllBytes(path);
  return new java.lang.String(bytes).toString();
}


if (typeof(module) !== "undefined") {
  var __filename = java.nio.file.Paths.get(new java.net.URI(module.uri));
  var __dirname = java.nio.file.Paths.get(__filename).getParent();
}


var require = function(id) {
  var req = null;
  var _paths = java.nio.file.Paths;
  var _files = java.nio.file.Files;
  var _current = _paths.get(__dirname || java.lang.System.getProperty("sprintstack.dir"));

  // Look for core module
  var coreModPath = _paths.get(__corePath + '/' + id + '.js');

  if (_files.exists(coreModPath)) {
    req = nativeRequire('./' + _current.relativize(coreModPath));
  }

  // Pull in a relative path
  if (id.indexOf('.') == 0) {
    var rel = _paths.get(__dirname + '/' + id);

    if (_files.exists(rel)){
      if (_files.isDirectory(rel)) {
        req = nativeRequire(id + '/index.js');
      } else {
        req = nativeRequire(id);
      }      
    } else
      req = nativeRequire(id + '.js')
  }

  // Look for a node_modules folder containing 'id'
  var npmPath = _current;
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
      var entryPoint = packageJsonPath.getParent().resolve(packageJson.main).normalize();
      if (!_files.exists(entryPoint))
        entryPoint = packageJsonPath.getParent().resolve(packageJson.main + '.js').normalize();
      var relative = './' + _current.relativize(entryPoint);
      req = nativeRequire(relative)
    }
  }

  if (req != null) req.dir = __dirname;

//  print(id)
//  print(__filename)

  return req;
}

require.paths = nativeRequire.paths;

global = this;

var console = require('console');
var timers = require('timers');
var future = require('future');
var process = require('process');

// Buffer
var Buffer = require('buffer');
this.Buffer = Buffer;

this.console = console;
this.setTimeout = timers.setTimeout;
this.setInterval = timers.setInterval;
this.clearInterval = timers.clearInterval;
this.clearTimeout = timers.clearTimeout;

this.alert = function(msg) { javax.swing.JOptionPane.showMessageDialog(null, msg); };

// TODO: put these rather dashing 
// extensions somewhere more appropriate
Number.prototype.times = function(fn) {
  var i;
  for (i = 0; i < this; i++) {
    fn(i);
  }
};

Array.prototype.equals = function(other) {
  return !(this<other || other<this);
};
