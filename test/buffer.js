var wru = require('./wru.js');

wru.test([
  {
    name: "buf.ctor length with int",
    test: function() {
      var b = new Buffer(10);
      wru.assert(true, b.length() == 10);
    }
  },
  {
    name: "buf.ctor length with array",
    test: function() {
      var b = new Buffer([1,2,3]);
      wru.assert(true, b.length() == 3);
    }
  },
  {
    name: "buf.ctor length with utf8 string",
    test: function() {
      var b = new Buffer("hello");
      wru.assert(true, b.length() == 5);
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
    name: "buf.put with oob negative byte value",
    test: function() {
      var b = new Buffer(3);
      b[0] = -2556;
      wru.assert(true, b[0] == 4);
    }
  },
  {
    name: "buf.put with oob positive byte value",
    test: function() {
      var b = new Buffer(3);
      b[0] = 2556;
      wru.assert(true, b[0] == 252);
    }
  }
]);

