importClass(java.io.RandomAccessFile);
importClass(java.nio.ByteBuffer);
importClass(java.nio.channels.FileChannel);

var Fs = function() {

  this.writeFileSync = function(filename, data) {
    var f = new RandomAccessFile(filename, 'rwd');
    var fc = f.getChannel();
    var bb = ByteBuffer.wrap(new java.lang.String(data).getBytes('UTF-8'));
    fc.write(bb);
  }

}

module.exports = new Fs();
