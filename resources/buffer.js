importClass(org.mozilla.javascript.ScriptableObject);
importClass(java.nio.ByteBuffer);

// Convert node.js => IANA charset names.
// TODO: base 64 + hex charset providers
var ENCODINGS = {
  "ascii": "US-ASCII",
  "utf8": "UTF-8",
  "utf-8": "UTF-8",
  "utf16le": "UTF-16LE",
  "ucs2": "UTF-16LE",
  "base64": "",
  "hex": ""
}

// Java byte value must fall within the range [-128, 127].
// Since a node.js buffer octet has a value within [0, 255],
// we need to perform signed<=>unsigned conversions.
function sign(n) {
  if (n < 128) return n;
  return (~n+1 & 0xFF) * -1
}
function unsign(n) { return n & 0xFF }

var Buffer = function(obj, encoding) {

  var internalBuffer = null;
  var internalCapacity = null;

  if (obj.constructor === Number)
  {
    internalBuffer = ByteBuffer.allocate(obj);
  } else if (obj.constructor === Array)
  {
    var signed = obj.map(function(a) { return sign(a) });
    internalBuffer = ByteBuffer.wrap(signed);
  } else if (obj.constructor === String)
  {
    if (!encoding) encoding = 'utf8';
    javaString = new java.lang.String(obj);
    internalBuffer = ByteBuffer.wrap(javaString.getBytes(ENCODINGS[encoding]));
  } else if (obj instanceof ByteBuffer) {
    internalBuffer = obj;
    var options = encoding;
    internalBuffer.position(options.start);
    internalBuffer.limit(options.end);
    internalCapacity = options.end - options.start;
  }

  var buf = new JavaAdapter(ScriptableObject,
                            {put: function(index, start, val) {
                              // We want to override the put() method with
                              // the signature:
                              // (int,Scriptable,Object).
                              this.super$put(index, start, val);

                              if (index.constructor === Number) {
                                var num = sign(val);
                                internalBuffer.put(index, num);
                              }
                            },
                             get: function(index, start) {
                               // Default behaviour if index != Number
                               if (index.constructor === String)
                                 return this.super$get(index, start);

                               var signed = internalBuffer.get(index);
                               return unsign(signed);
                             },
                             getClassName: function() {
                               return "Buffer";
                             }
                            });

  buf.__internalBuffer = internalBuffer;

  buf._charsWritten = 0;

  buf.__defineGetter__("length", function() {
    return (internalCapacity || internalBuffer.capacity());
  });

  buf.write = function(string, offset, length, encoding) {
    // Support both (string, offset, length, encoding)
    // and the legacy (string, encoding, offset, length)
    if (isFinite(offset)) {
      if (!isFinite(length)) {
        encoding = length;
        length = undefined;
      }
    } else {  // legacy
      var swap = encoding;
      encoding = offset;
      offset = length;
      length = swap;
    }

    offset = +offset || 0;
    var remaining = buf.length - offset;
    if (!length) {
      length = remaining;
    } else {
      length = +length;
      if (length > remaining) {
        length = remaining;
      }
    }

    ianaEncoding = ENCODINGS[encoding];

    var rawString = new java.lang.String(string);
    var rawBytes = rawString.getBytes(ianaEncoding);

    internalBuffer.position(offset);
    var oldLimit = internalBuffer.limit();
    internalBuffer.limit(length);

    // When rawBytes is bigger than the
    // ByteBuffer's remaining capacity
    // Java throws a BufferOverflowException
    // whereas node 'fails' silently, so
    // let's check beforehand
    if (rawBytes.length > internalBuffer.remaining()) {
      // TODO: check we're not writing partial characters
      // after performing a slice()
      rawBytes = rawBytes.slice(0, internalBuffer.remaining());
    }

    internalBuffer.put(rawBytes);

    internalBuffer.limit(oldLimit);
    buf._charsWritten = rawBytes.length;

    return buf._charsWritten;
  };
  
  buf.toString = function(encoding, start, end) {
    if (!encoding) encoding = 'utf8';
    if (!start) start = 0;
    if (!end) end = buf.length - start;

    var ianaEncoding = ENCODINGS[encoding];
    var backingArray = internalBuffer.array().map(function(e) { return unsign(e) });

    var str = new java.lang.String(backingArray, start, end, ianaEncoding);
    return str;
  };

  buf.copy = function(target, target_start, start, end) {
    var source = buf;
    start || (start = 0);
    end || (end = source.length);
    target_start || (target_start = 0);

    if (end < start) throw new Error('sourceEnd < sourceStart');

    // Copy 0 bytes; we're done
    if (end === start) return 0;
    if (target.length == 0 || source.length == 0) return 0;

    if (target_start < 0 || target_start >= target.length) {
      throw new Error('targetStart out of bounds');}

    if (start < 0 || start >= source.length) {
      throw new Error('sourceStart out of bounds');}

    if (end < 0 || end > source.length) {
      throw new Error('sourceEnd out of bounds');}

    // Are we oob?
    if (end > source.length) end = source.length;

    if (target.length - target_start < end - start) {
      end = target.length - target_start + start;
    }

    source.__internalBuffer.limit(end);
    source.__internalBuffer.position(start);
    target.__internalBuffer.position(target_start);
  
    print(internalBuffer)
    target.__internalBuffer.put(internalBuffer);
  };

  buf.slice = function(start, end) {
    if (!start) start = 0;
    if (!end) end = internalBuffer.capacity() - start;

    return new Buffer(internalBuffer.slice(), {start: start, end: end});
  };

  return buf;
}

// Static methods
Buffer.isBuffer = function(buffer) {
  return buffer instanceof Buffer;
}

Buffer.byteLength = function(str, encoding) {
  return new Buffer(str, encoding).length;
}

// straight from Joyent's implementation
Buffer.concat = function(list, length) {
  if (!Array.isArray(list)) {
    throw new Error('Usage: Buffer.concat(list, [length])');}
     

  if (list.length === 0) {
    return new Buffer(0);}
   else if (list.length === 1) {
    return list[0];}
   

  if (typeof length !== 'number') {
    length = 0;
    for (var i = 0; i < list.length; i++) {
      var buf = list[i];
      length += buf.length;}}
  

  var buffer = new Buffer(length);
  var pos = 0;
  for (var i = 0; i < list.length; i++) {
    var buf = list[i];
    buf.copy(buffer, pos);
    pos += buf.length;}
  
  return buffer;
};


module.exports = Buffer;

