importClass(java.io.File);
importClass(java.io.RandomAccessFile);
importClass(java.nio.ByteBuffer);
importClass(java.nio.channels.FileChannel);
importClass(java.nio.charset.Charset);

var charset = Charset.forName("UTF-8");

var Stats = function(obj) {
  this.isFile = function() {
    return obj.isFile();
  }

  this.isDirectory = function() {
    return obj.isDirectory();
  }

  this.isBlockDevice = function() {
    throw new Error("isBlockDevice unimplemented");
  }

  this.isCharacterDevice = function() {
    throw new Error("isCharacterDevice unimplemented");
  }

  this.isFIFO = function() {
    throw new Error("isFIFO unimplemented");
  }

  this.isSocket = function() {
    throw new Error("isSocket unimplemented");
  }
}

exports.Stats = Stats;

exports.writeFileSync = function(filename, data) {
  var f = new RandomAccessFile(filename, 'rwd');
  var fc = f.getChannel();
  var bb = ByteBuffer.wrap(new java.lang.String(data).getBytes('UTF-8'));
  fc.write(bb);
};

exports.readFileSync = function(filename, encoding) {
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

exports.readdirSync = function(path) {
  var fd = new File(path);
  return fd.list().map(function(d) {
    return d;
  });
}

exports.statSync = function(path) {
  var obj = new File(path);
  return new Stats(obj);
}

