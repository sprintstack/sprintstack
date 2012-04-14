exports.hostname = function() {
  return java.net.InetAddress.getLocalHost().getHostName();
}
