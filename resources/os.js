var OS = function() {
  this.hostname = function() {
    return java.net.InetAddress.getLocalHost().getHostName();
  }
};

exports = new OS();

