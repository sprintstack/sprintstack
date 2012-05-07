importClass(java.nio.ByteBuffer);

var fun = require('match');

var $ = fun.parameter;
var _ = fun.wildcard;

// encoding scheme lookup for node.js compat
// for now, we'll stick with just supporting ASCII & UTF-8
// key = node.js param, value = Java charset
var encodings = {
  "ascii" : "US-ASCII",
  "utf8" : "UTF-8",
}

var Buffer = function() {
  var self = this;

  ctor = fun(
    [[String], function(s) {
      return new Buffer(s, 'utf8');
    }],
    [[String, String], function(s, enc) {
      bytes = new java.lang.String(s).getBytes(encodings[enc]);
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
        return self.write(s, 0, s.length, 'utf8');
      }],
      [[String, Number, Number, String], function(s, offset, length, enc) {
        bytes = new java.lang.String(s).getBytes(encodings[enc]);
        self.byteBuffer.put(bytes, (offset || 0), bytes.length);
        return true;
      }]
    );
    writer(args);
  }

  this.length = this.byteBuffer.capacity();

};

byteLength = function() {
  args = Array.prototype.slice.call(arguments);

  size = fun(
    [[String], function(s) {
      return self.byteLength(s, 'utf8');
    }],
    [[String, String], function(s, enc) {
      str = new java.lang.String(s).getBytes(encodings[enc]);
      return str.length;
    }]
  );

  size(args)
}

module.exports = Buffer;

