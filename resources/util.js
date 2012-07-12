function s (str) {
  // Based on s.js by Guillermo Rauch
  // https://github.com/guille/s.js
  var i = 1, args = arguments;
  return String(str).replace(/%?%(d|s|j)/g, function (symbol, type) {
    if ('%' == symbol[1]) return symbol;
      var arg = args[i++];
      switch (type) {
        case 'd': return Number(arg);
        case 'j': return JSON.stringify(arg);
      }
      return String(arg);
  });
};

s.extend = function () {
  String.prototype.s = function () {
    var arr = [this];
    arr.push.apply(arr, arguments)
    return s.apply(null, arr);
  }
};

var Util = function() {

  this.format = s;

  this.inherits = function(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true}});
  };

  this.isArray = function (ar) {
    return Array.isArray(ar) ||
      (typeof ar === 'object' && objectToString(ar) === '[object Array]');
  };

  this.sleep = function(ms) {
    java.lang.Thread.sleep(ms);
  }

  this.merge = function(obj1, obj2) {
    for (var key in obj2) obj1[key] = obj2[key];
  }

  this.deprecate = function(fn, msg) {}

};

module.exports = new Util();

