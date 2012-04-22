importClass(com.mowforth.rhinode.core.IDNS);

var DNS = function() {

  this.resolve = function(domain, rrtype, callback) {
    var records = IDNS.resolve(domain, rrtype);
    callback(null, records);
  }

};

module.exports = new DNS();

