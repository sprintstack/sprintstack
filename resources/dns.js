importClass(com.mowforth.rhinode.core.IDNS);

var DNS = function() {

  this.resolve = function(domain, rrtype, callback) {
    var records = IDNS.lookup(domain, rrtype);
    callback(null, records);
  }

  this.lookup = function(domain, family, callback) {
    // This just does an IPV4 lookup for now...
    // I presume that's not gonna be a deal-breaker
    this.resolve(domain, "A", callback);
  }

  this.resolve4 = function(domain, callback) {
    this.resolve(domain, "A", callback);
  }

  this.resolve6 = function(domain, callback) {
    this.lookup(domain, "AAAA", callback);
  }

  this.resolveMx = function(domain, callback) {
    this.lookup(domain, "MX", callback);
  }

  this.resolveTxt = function(domain, callback) {
    this.lookup(domain, "TXT", callback);
  }

  this.resolveSrv = function(domain, callback) {
    this.lookup(domain, "SRV", callback);
  }

  this.resolveNs = function(domain, callback) {
    this.lookup(domain, "NS", callback);
  }

  this.resolveCname = function(domain, callback) {
    this.lookup(domain, "CNAME", callback);
  }

  this.reverse = function(ip, callback) {
    var reverseIp = ip.split("").reverse().join("");
    var ptr = reverseIp.concat("in-addr.arpa");
    IDNS.lookup(ptr, "PTR");
  }

};

module.exports = new DNS();

