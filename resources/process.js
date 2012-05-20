importClass(java.lang.Runtime);
importClass(java.lang.System);
importClass(java.lang.management.ManagementFactory);

var os = require('os');

var Process = function() {

  var mx = ManagementFactory.getRuntimeMXBean();
  var rt = Runtime.getRuntime();

  this.platform = os.type();

  this.arch = os.arch();

  this.pid = System.getProperty("sprintstack.pid");

  this.nextTick = function(callback) {
    return new future(callback);
  }

  this.uptime = function() {
    return mx.getUptime();
  }

  this.getgid = function() {
    return System.getProperty("sprintstack.gid");
  }

  this.getuid = function() {
    return System.getProperty("sprintstack.uid");
  }

  this.memoryUsage = function() {
    var heap = rt.totalMemory();
    var used = heap - rt.freeMemory();
    return {
      heapTotal: heap,
      heapUsed: used
    };
  }

  this.exit = function() {
    var code = 0;
    if (arguments.length > 0) code = arguments[0];
    java.lang.System.exit(code);
  };

};

module.exports = new Process();

