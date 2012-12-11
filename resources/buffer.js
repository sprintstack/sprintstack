importClass(org.mozilla.javascript.ScriptableObject);
importClass(java.nio.ByteBuffer);

// Convert node.js => IANA charset names.
// TODO: base 64 + hex charset providers
var ENCODINGS = {
  "ascii": "US-ASCII",
  "utf8": "UTF-8",
  "utf16le": "UTF-16LE",
  "ucs2": "UTF-16LE",
  "base64": "",
  "hex": ""
}

// Java byte value must fall within the range [-128, 127].
// Since a node.js buffer octet has a value within [0, 255],
// we don't care about negative values.
var BYTE_OFFSET = 0x80; // 128
var BYTE_CAST = 0xFF; // 255

var Buffer = function(obj, encoding) {

  var internalBuffer = null;

  if (obj.constructor === Number)
  {
    internalBuffer = ByteBuffer.allocate(obj);
  } else if (obj.constructor === Array)
  {
    internalBuffer = ByteBuffer.wrap(obj);
  } else if (obj.constructor === String)
  {
    if (!encoding) encoding = 'UTF-8';
    javaString = new java.lang.String(obj);
    internalBuffer = ByteBuffer.wrap(javaString.getBytes(encoding));
  } else if (obj instanceof ByteBuffer) {
    internalBuffer = obj;
  }

  var buf = new JavaAdapter(ScriptableObject,
                            {put: function(index, start, val) {
                              // We want to override the put() method with
                              // the signature:
                              // (int,Scriptable,Object).
                              this.super$put(index, start, val);

                              if (index.constructor === Number) {
                                var num = (val & BYTE_CAST) - BYTE_OFFSET;

                                internalBuffer.put(index, num);
                              }
                            },
                             get: function(index, start) {
                               // Default behaviour if index != Number
                               if (index.constructor === String)
                                 return this.super$get(index, start);

                               return internalBuffer.get(index) + BYTE_OFFSET;
                             },
                             getClassName: function() {
                               return "Buffer";
                             }
                            });

  buf.length = function() {
    return internalBuffer.capacity();
  };

  buf.write = function(str, offset, length, encoding) {                            
  };
  
  buf.toString = function(encoding, start, end) {
    if (!encoding) encoding = 'utf8';
    if (!start) start = 0;
    if (!end) end = buf.length() - start;

    var ianaEncoding = ENCODINGS[encoding];
    var backingArray = internalBuffer.array().map(function(e) { return e + BYTE_OFFSET })
    var foo = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, backingArray.length);

    for (var i = 0; i < foo.length; i++)
      foo[i] = backingArray[i];

    var str = new java.lang.String(foo, start, end, ianaEncoding);
    return str;
  };

  buf.copy = function(target, targetStart, sourceStart, sourceEnd) {
  };

  buf.slice = function(start, end) {
    if (!start) start = 0;
    if (!end) end = buf.length() - start;

    // TODO: This is simpler than ByteBuffer.slice(), but
    // array() is JVM-dependent. Investigate a better way
    // of creating sub-Buffers?
    var array = internalBuffer.array().slice(start, end);
    var sliced = ByteBuffer.wrap(array);

    return new Buffer(sliced);
  };

  return buf;
}

//Static methods
Buffer.isBuffer = function(buffer) {
  return buffer instanceof Buffer;
}

Buffer.byteLength = function(str, encoding) {
  return new Buffer(str, encoding).length();
}

// concat is lazy. It doesn't join the contents of the buffers
// together and return a new one; instead it returns a 'pseudo-Buffer'
// which, to the consumer behaves like one contiguous block of memory.
// As all the common Java N/IO channels support scattered reads + gathered
// writes, this negates the need to perform any copying.
Buffer.concat = function(buffers, totalLength) {
}

module.exports = Buffer;

