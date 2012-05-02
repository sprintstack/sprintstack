importClass(java.lang.System);
importClass(java.lang.Runtime)

var OS = function() {
  this.hostname = function() {
    return java.net.InetAddress.getLocalHost().getHostName().toString();
  }

  this.type = function() {
    return System.getProperty('os.name').toString();
  }

  this.arch = function() {
    return System.getProperty('os.arch').toString();
  }

  this.release = function() {
    return System.getProperty('os.version').toString();
  }

  this.freemem = function() {
    return Runtime.getRuntime().freeMemory();
  }

  this.totalmem = function() {
    return Runtime.getRuntime().maxMemory();
  }
};

exports = new OS();

