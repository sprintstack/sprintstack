// Based on s.js by Guillermo Rauch
// https://github.com/guille/s.js
function s (str) {
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

  this.format = s

}

module.exports = new Util();

