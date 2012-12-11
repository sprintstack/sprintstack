importClass(org.mozilla.javascript.ScriptableObject);
importClass(java.nio.ByteBuffer);

// Convert node.js => IANA charset names.
// TODO: base 64 + hex charset providers
var encodings = {
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
    if (Buffer.isBuffer(obj[0])) {
      // TODO: handle calls from Buffer.concat()
      isContiguous = false;
    } else {
      internalBuffer = ByteBuffer.wrap(obj);
    }
  } else if (obj.constructor === String)
  {
    if (!encoding) encoding = 'UTF-8';
    javaString = new java.lang.String(obj);
    internalBuffer = ByteBuffer.wrap(javaString.getBytes(encoding));
  }

  var buf = new JavaAdapter(ScriptableObject,
                            {put: function(index, start, val) {
                              // Overrides ScriptableObject/put()
                              // TODO: As Rhino dynamically dispatches
                              // to the correct overload, it's not
                              // obvious that this overrides the put
                              // method with signature:
                              // (int,Scriptable,Object). Should
                              // probably have some kind of type check
                              // to make sure 'index' really is a number.
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
  };

  buf.copy = function(target, targetStart, sourceStart, sourceEnd) {
  };

  buf.slice = function(start, end) {
  };

  return buf;
}

//Static methods
Buffer.isBuffer = function(buffer) {
  return buffer instanceof Buffer;
}

Buffer.byteLength = function(str, encoding) {
  // TODO
}

// concat is lazy. It doesn't join the contents of the buffers
// together and return a new one; instead it returns a 'pseudo-Buffer'
// which, to the consumer behaves like one contiguous block of memory.
// As all the common Java N/IO channels support scattered reads + gathered
// writes, this negates the need to perform any copying.
Buffer.concat = function(buffers, totalLength) {
  // TODO
}

module.exports = Buffer;

