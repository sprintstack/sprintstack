importClass(java.io.File);
importClass(java.io.RandomAccessFile);
importClass(java.nio.ByteBuffer);
importClass(java.nio.channels.FileChannel);
importClass(java.nio.charset.Charset);

var charset = Charset.forName("UTF-8");

var Fs = function() {

  this.getFullPath = function (path) {
    if (path[0] != '/') {
      path = this.dir + '/' + path;
    }
    return path;
  }

  this.writeFileSync = function(filename, data) {
    var f = new RandomAccessFile(filename, 'rwd');
    var fc = f.getChannel();
    var bb = ByteBuffer.wrap(new java.lang.String(data).getBytes('UTF-8'));
    fc.write(bb);
  }

  this.readFileSync = function(filename, encoding) {
    var fullPath = this.getFullPath(filename);
    var f = new RandomAccessFile(fullPath, 'r');
    var fc = f.getChannel();
    var bb = ByteBuffer.allocate(512);

    var out = "";

    while (fc.read(bb) != -1) {
      var decoded = charset.decode(bb);
      out.concat(decoded.toString());
      bb.clear();
      bb.rewind();
    }

    return out;
  }

  this.readdirSync = function(path) {
    var fullPath = this.getFullPath(path);
    var fd = new File(fullPath);
    return fd.list().map(function(d) {
      return d;
    });
  }

}

module.exports = new Fs();
