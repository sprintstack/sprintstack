importClass(com.mowforth.rhinode.ModuleLoader);
importClass(com.mowforth.rhinode.dispatch.Dispatch);
importClass(Packages.akka.dispatch.OnComplete);
importClass(java.util.concurrent.Callable);

var require = function(id) {

  path = ModuleLoader.resolveString(id);

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

var async = function() {
  var args = Array.prototype.slice.call(arguments);

  var task = new Callable({call: args.shift()});

  if (args.length > 0) {
    var cb = new JavaAdapter(OnComplete, {onComplete: args.shift()});
    return Dispatch.future(task).andThen(cb);
  } else {
    return Dispatch.future(task);
  }
};

global = this;

var fun = require('match');
var Buffer = require('buffer');
var console = require('console');
var timers = require('timers');

global.console = console;

this.setTimeout = timers.setTimeout;
this.setInterval = timers.setInterval;
this.clearInterval = timers.clearInterval;
this.clearTimeout = timers.clearTimeout;

this.alert = function(msg) { javax.swing.JOptionPane.showMessageDialog(null, msg); };

