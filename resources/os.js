importPackage(java.lang);

var OS = function() {
  this.hostname = function() {
    return java.net.InetAddress.getLocalHost().getHostName();
  }

  this.type = function() {
    return System.getProperty('os.name');
  }

  this.arch = function() {
    return System.getProperty('os.arch');
  }

  this.release = function() {
    return System.getProperty('os.version');
  }

  this.freemem = function() {
    return Runtime.getRuntime().freeMemory();
  }

  this.totalmem = function() {
    return Runtime.getRuntime().maxMemory();
  }
};

exports = new OS();

