var URL = function() {

  this.parse = function() {
    var url = new java.net.URL(arguments[0]);
    var parsed = {
      href: arguments[0],
      protocol: url.getProtocol(),
      host: url.getHost(),
      auth: url.getAuthority(),
      hostname: url.getHost().toLowerCase(),
      port: url.getPort(),
      pathname: url.getPath(),
      search: url.getQuery(),
      hash: url.getRef()
    };

    if (arguments[1] != null) {
      if (arguments[1] == true && parsed.search != null) {
        var params = {};
        var tuples = parsed.search.split("&");
        tuples.forEach(function(t) {
          var k_v = t.split("=");
          var key = k_v[0];
          var val = k_v[1];
          params.key = val;
        });
        parsed.query = params;
      }
    }

    return parsed;
  }

  this.format = function(urlObj) {
    var url = new java.net.URL(urlObj.protocol,
                              urlObj.hostname,
                              urlObj.port,
                              urlObj.pathname);

    return url.toString();
  }

}

module.exports = new URL();

