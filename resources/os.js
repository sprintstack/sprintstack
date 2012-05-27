importClass(java.lang.System);
importClass(java.lang.Runtime)
importClass(java.net.NetworkInterface);

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

  this.networkInterfaces = function() {
    var interfaces = NetworkInterface.getNetworkInterfaces();
    var ifs = {};

    while (interfaces.hasMoreElements()) {
      var iface = interfaces.nextElement();
      var addresses = iface.getInetAddresses();
      var addrs = [];

      while (addresses.hasMoreElements()) {
        var addr = addresses.nextElement();
        var ipfamily = addr.getHostAddress().indexOf(":") != -1 ? 'IPv6' : 'IPv4';
        var info = {
          address: new String(addr.getHostAddress()),
          family: ipfamily,
          internal: addr.isLoopbackAddress()
        };
        addrs.push(info);
      }

      ifs[iface.getName().toString()] = addrs;

    }

    return ifs;
  }
};

module.exports = new OS();

