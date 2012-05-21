importClass(Packages.org.jboss.netty.handler.codec.http.QueryStringDecoder);
importClass(Packages.org.jboss.netty.handler.codec.http.QueryStringEncoder);

var QueryString = function() {

  this.stringify = function(params) {
    var encoder = new QueryStringEncoder("");
    for (var key in params) encoder.addParam(key, params[key]);
    return encoder.toString().slice(1);
  }

  this.parse = function(str) {
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

