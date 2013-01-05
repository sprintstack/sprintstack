importClass(java.lang.System);
importClass(java.lang.Runtime)
importClass(java.lang.management.ManagementFactory);
importClass(java.net.NetworkInterface);

var OS = function() {
  this.hostname = function() {
    return java.net.InetAddress.getLocalHost().getHostName().toString();
  }

  this.type = function() {
    return System.getProperty('os.name').toString();
  }

  this.platform = function() {
    return 'Java';
  }

  this.arch = function() {
    return System.getProperty('os.arch').toString();
  }

  this.release = function() {
    return System.getProperty('os.version').toString();
  }

  this.uptime = function() {
    var uptimeMs = ManagementFactory.getRuntimeMXBean().getUptime();
    return uptimeMs / 1000;
  }

  this.freemem = function() {
    return Runtime.getRuntime().freeMemory();
  }

  this.totalmem = function() {
    return Runtime.getRuntime().maxMemory();
  }

  this.cpus = function() {
    // There is no platform-independent way of querying system
    // CPU specifics with the JVM; to prevent regular node.js apps
    // breaking we return an empty array.
    return [];
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

