importClass(Packages.org.jboss.netty.handler.codec.http.QueryStringDecoder);
importClass(Packages.org.jboss.netty.handler.codec.http.QueryStringEncoder);

var QueryString = function() {

  this.stringify = function(params, sep, eq) {
    var encoder = new QueryStringEncoder("");
    for (var key in params) {
      val = params[key];
      if (val.constructor === Array) {
        val.forEach(function(v) {
          encoder.addParam(key, v);
        });
      } else {
        encoder.addParam(key, val);
      }
    }
    var built = encoder.toString().slice(1);

    if (sep) built = built.replace(/&/g, sep);
    if (eq) built = built.replace(/=/g, eq);
    return built;
  }

  this.parse = function(str, sep, eq) {
    if (sep) str = str.replace(sep, "&", "g");
    if (eq) str = str.replace(eq, "=", "g");

    var parser = new QueryStringDecoder("?" + str);
    var params = parser.getParameters().entrySet().iterator();
    var parsed = {};
    while (params.hasNext()) {
      var nxt = params.next();
      var val = nxt.getValue();
      if (val.size() > 1) {
        var opts = []
        var i = val.iterator();
        while (i.hasNext()) opts.push(i.next())
        parsed[nxt.getKey().toString()] = opts;
      } else {
        parsed[nxt.getKey().toString()] = val.get(0).toString();
      }
      
    }
    return parsed;
  }

}

module.exports = new QueryString();

