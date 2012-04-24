importClass(com.mowforth.rhinode.core.IDNS);

var DNS = function() {

  this.resolve = function(domain, rrtype, callback) {
    async(function() {
      return IDNS.lookup(domain, rrtype);
    }, function(err, result) {
      var data = []; var record = null;
      while ((record = result.next()) != null) {
        data.push(record);
      }
      
      callback(err, data);
    });
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
    this.resolve(domain, "AAAA", callback);
  }

  this.resolveMx = function(domain, callback) {
    this.resolve(domain, "MX", callback); 
  }

  this.resolveTxt = function(domain, callback) {
    this.resolve(domain, "TXT", callback);
  }

  this.resolveSrv = function(domain, callback) {
    this.resolve(domain, "SRV", callback);
  }

  this.resolveNs = function(domain, callback) {
    this.resolve(domain, "NS", callback);
  }

  this.resolveCname = function(domain, callback) {
    this.resolve(domain, "CNAME", callback);
  }

  this.reverse = function(ip, callback) {
    var reverseIp = ip.split("").reverse().join("");
    var ptr = reverseIp.concat("in-addr.arpa");
    this.resolve(ptr, "PTR", callback);
  }

};

module.exports = new DNS();

