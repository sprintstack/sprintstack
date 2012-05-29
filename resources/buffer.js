importClass(java.nio.ByteBuffer);

var match = require('match');

var encodings = {
  'utf8' : 'UTF-8'
};

var Buffer = function() {

  var args = match(
    [[Number], function(n) {
      this.internalBuffer = ByteBuffer.allocate(n);
      this.internalBuffer.clear();
    }],
    [[Array], function(a) {
      this.internalBuffer = ByteBuffer.allocate(a.length*8);
      this.internalBuffer.clear();
      a.forEach(function(x) {
        this.internalBuffer.putLong(x);
      });
    }],
    [[String], function(s) {
      return new Buffer(s, 'utf-8');
    }],
    [[String, String], function(str, enc) {
      this.internalBuffer = ByteBuffer.wrap(str, encodings[enc]);
    }]);

  args.call(this, Array.prototype.slice.call(arguments));

  return this;

};

module.exports = Buffer;

