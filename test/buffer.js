var wru = require('./wru.js');

wru.test([
  {
    name: "buf.ctor length with int",
    test: function() {
      var b = new Buffer(10);
      wru.assert(true, b.length == 10);
    }
  },
  {
    name: "buf.ctor length with array",
    test: function() {
      var b = new Buffer([1,2,3]);
      wru.assert(true, b.length == 3);

      wru.assert(true, b[0] == 1);
      wru.assert(true, b[1] == 2);
      wru.assert(true, b[2] == 3);
    }
  },
  {
    name: "buf.ctor length with utf8 string",
    test: function() {
      var b1 = new Buffer("hello");
      wru.assert(true, b1.length == 5);

      var b2 = new Buffer("☃-⌘");
      wru.assert(true, b2.length == 7);
    }
  },
  {
    name: "buf.put with max byte value",
    test: function() {
      var b = new Buffer(3);
      b[0] = 0xFF;
      wru.assert(true, b[0] == 255);
    }
  },
  {
    name: "buf.put with min byte value",
    test: function() {
      var b = new Buffer(3);
      b[0] = 0x00;
      wru.assert(true, b[0] == 0);
    }
  },
  {
    name: "buf.put with oob positive byte value",
    test: function() {
      var b = new Buffer(3);
      b[0] = 400;
      wru.assert(true, b[0] == 144);
    }
  },
  {
    name: "Buffer.isBuffer",
    test: function() {
      var b = new Buffer(1);
      var whatever = "foo";

      wru.assert(true, Buffer.isBuffer(b));
      wru.assert(true, !Buffer.isBuffer(whatever));
    }
  },
  {
    name: "Buffer.byteLength",
    test: function() {
      var length = Buffer.byteLength("☃-⌘");

      wru.assert(true, length == 7);
    }
  },
  {
    name: "Buffer.write",
    test: function() {
      var buf = new Buffer(5);

      wru.assert(true, buf._charsWritten == 0);

      wru.assert(true, buf.write("Hello", "utf8") == 5);
      wru.assert(true, buf._charsWritten == 5);
    }
  },
  {
    name: "Buffer.copy",
    test: function() {
      // From docs.nodejitsu.com
      var frosty = new Buffer(24);
      var snowman = new Buffer("☃", "utf-8");

      frosty.write("Happy birthday! ", "utf-8");
      snowman.copy(frosty, 16);

      console.log(frosty.toString());
    }
  },
  {
    name: "Buffer.concat with two buffers",
    test: function() {
/*      var b1 = new Buffer("foo");
      var b2 = new Buffer("bar");

      var b3 = Buffer.concat([b1,b2]);

      wru.assert(true, b3.length == (b1.length + b2.length));*/
    }
  },
  {
    name: "buf.toString('utf8')",
    test: function() {
      var content = "hello, world!";
      var buf = new Buffer(content);

      // With no argument it should default to utf8
      wru.assert(true, buf.toString() == content);
      wru.assert(true, buf.toString('utf8') == content);
      wru.assert(true, buf.toString('utf8', 1, 3) == "el");
    }
  },
  {
    name: "buf.slice",
    test: function() {
      var buf1 = new Buffer("hello, world!");
      var buf2 = buf1.slice(0, 3);

      wru.assert(true, buf2.length == 3);
      wru.assert(true, buf2[0] == buf1[0]);
    }
  },
  {
    name: "buf.slice2",
    test: function() {
      // example from the node doc
      var buf1 = new Buffer(26);

      for (var i = 0 ; i < 26 ; i++) {
        buf1[i] = i + 97; // 97 is ASCII a
      }

      var buf2 = buf1.slice(0, 3);

      wru.assert(true, buf2.toString() == 'abc');
      buf1[0] = 33; // 33 == ASCII '!'
      wru.assert(true, buf2.toString() == '!bc');
    }
  },
  {
    name: "buf.slice from nonzero offset",
    test: function() {
      
    }
  }
]);

