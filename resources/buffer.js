importClass(java.nio.ByteBuffer);

var fun = require('match');

var $ = fun.parameter;
var _ = fun.wildcard;

var Buffer = function() {
  var self = this;

  ctor = fun(
    [[String], function(s) {
      return new Buffer(s, 'UTF-8');
    }],
    [[String, String], function(s, enc) {
      bytes = new java.lang.String(s).getBytes(enc);
      return ByteBuffer.wrap(bytes);
    }],
    [[Number], function(n) {
      return ByteBuffer.allocate(n);
    }],
    [[Array], function(a) {
      return ByteBuffer.wrap(a);
    }]
  );

  this.byteBuffer = ctor(Array.prototype.slice.call(arguments));

  this.write = function() {
    args = Array.prototype.slice.call(arguments);
    writer = fun(
      [[String], function(s) {
        return self.write(s, 0, s.length, 'UTF-8');
      }],
      [[String, Number, Number, String], function(s, offset, length, enc) {
        bytes = new java.lang.String(s).getBytes(enc);
        self.byteBuffer.put(bytes, (offset || 0), bytes.length);
        return true;
      }]
    );
    writer(args);
  }

  this.length = this.byteBuffer.capacity();

};

module.exports = Buffer;

