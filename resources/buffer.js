importClass(java.nio.ByteBuffer);

var Buffer = function(ctor) {
  if (ctor.constructor == Number) {
//    this.internalBuffer = ByteBuffer.allocate(ctor);
    console.log('num');
    console.log(module.uri);
  }
};

module.exports = Buffer;

